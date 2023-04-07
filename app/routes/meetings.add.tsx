import type { ActionFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Form, Template } from "~/components";
import { formatValidator } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, saveFeedToStorage } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = formatValidator("meeting");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }

  const {
    currentAccountID,
    userID,
    name,
    day,
    time,
    timezone,
    duration,
    conference_url,
    conference_url_notes,
    conference_phone,
    conference_phone_notes,
    notes,
    languages,
    types,
  } = data;

  // update meeting
  const meeting = await db.meeting.create({
    data: {
      name,
      day,
      time,
      timezone,
      duration,
      conference_url,
      conference_url_notes,
      conference_phone,
      conference_phone_notes,
      notes,
      languages: {
        connect: [
          ...languages.map((code: string) => ({
            code,
          })),
        ],
      },
      types: types.length
        ? {
            connect: [
              ...types.map((code: string) => ({
                code,
              })),
            ],
          }
        : undefined,
      accounts: { connect: { id: currentAccountID } },
    },
  });

  // create an activity record
  await db.activity.create({
    data: {
      type: "create",
      meetingID: meeting.id,
      userID: userID,
    },
  });

  try {
    await saveFeedToStorage(data.currentAccountID);
    return json({ success: "JSON updated." });
  } catch (e) {
    if (e instanceof Error) {
      return json({ error: e.message });
    }
  }
  return null;
};

export const meta: MetaFunction = () => ({
  title: strings.meetings.title,
});

export default function CreateMeeting() {
  const actionData = useActionData();
  const { currentAccountID, id } = useUser();
  return (
    <Template
      title={strings.meetings.add}
      breadcrumbs={[["/meetings", strings.meetings.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Form
        title={strings.meetings.details}
        description={strings.meetings.details_description}
        form="meeting"
        values={{
          currentAccountID,
          userID: id,
        }}
      />
    </Template>
  );
}

import type {
  Activity,
  Change,
  Group,
  Language,
  Meeting,
  Type,
  User,
} from "@prisma/client";
import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useActionData, useLoaderData } from "@remix-run/react";

import {
  Alerts,
  Button,
  Columns,
  Form,
  Panel,
  Table,
  Template,
} from "~/components";
import {
  fields,
  formatActivity,
  formatChanges,
  formatDate,
  formatDayTime,
  formatString,
  formatValidator,
  formatValue,
  validObjectId,
} from "~/helpers";
import { strings } from "~/i18n";
import { addGroupRep, editGroupRep, removeGroupRep } from "~/models";
import { db, getIDs, jsonWith } from "~/utils";

export const action: ActionFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const formData = await request.formData();
  const subaction = formData.get("subaction");

  const { accountID, userID } = await getIDs(request);

  if (subaction === "group-rep-add") {
    return addGroupRep(formData, id, userID, accountID);
  }

  if (subaction === "group-rep-edit") {
    return editGroupRep(formData, id, userID, accountID);
  }

  if (subaction === "group-rep-remove") {
    return removeGroupRep(formData, id, userID);
  }

  const group = await db.group.findUnique({
    where: { id },
    include: {
      meetings: true,
    },
  });
  if (!group) {
    return redirect("/groups"); // todo flash invalid id message to this page
  }

  const validator = formatValidator("group");
  const { data, error } = await validator.validate(formData);
  if (error) {
    return validationError(error);
  }

  const changes = formatChanges(fields.group, group, data);

  // exit if no changes
  if (!changes.length) {
    return json({ info: strings.no_updates });
  }

  // create an activity record
  const activity = await db.activity.create({
    data: {
      type: "update", // todo change this to "updateGroup" ?
      groupID: id,
      userID,
    },
  });

  // save individual changes
  changes.forEach(
    async ({ field, before, after }) =>
      await db.change.create({
        data: {
          activityID: activity.id,
          before: formatValue(before),
          after: formatValue(after),
          field,
        },
      })
  );

  // update group
  const changed = Object.fromEntries(
    changes
      .filter(({ type }) => type !== "checkboxes")
      .map(({ field, after }) => [field, after])
  );

  await db.group.update({
    data: { ...changed, updatedAt: new Date() },
    where: { id },
  });

  return json({ success: strings.group.updated });
};

export const loader: LoaderFunction = async ({ params: { id }, request }) => {
  if (!validObjectId(id)) {
    throw new Response(null, {
      status: 404,
      statusText: strings.group.notFound,
    });
  }

  const group = await db.group.findUniqueOrThrow({
    select: {
      id: true,
      name: true,
      recordID: true,
      notes: true,
      email: true,
      phone: true,
      website: true,
      venmo: true,
      paypal: true,
      square: true,
      meetings: {
        select: {
          day: true,
          time: true,
          timezone: true,
          name: true,
          updatedAt: true,
          id: true,
          languages: { select: { code: true } },
          types: { select: { code: true } },
        },
        where: {
          archived: false,
        },
        orderBy: [
          {
            day: "asc",
          },
          {
            time: "asc",
          },
        ],
      },
    },
    where: { id },
  });

  const users = await db.user.findMany({
    where: {
      groupIDs: { has: id },
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailHash: true,
      lastSeen: true,
      groups: {
        select: {
          id: true,
          name: true,
        },
        where: {
          id: { not: id },
        },
      },
    },
  });

  const activities = await db.activity.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      createdAt: true,
      approved: true,
      changes: {
        select: { field: true },
      },
      meeting: {
        select: {
          id: true,
          name: true,
        },
      },
      type: true,
      user: {
        select: {
          name: true,
          emailHash: true,
        },
      },
    },
    take: 5,
    where: { groupID: id },
  });

  return jsonWith(request, { activities, group, users });
};

export default function GroupEdit() {
  const { activities, alert, group, users } = useLoaderData();
  const actionData = useActionData();
  const alerts = { ...actionData, ...alert };
  return (
    <Template
      breadcrumbs={[["/groups", strings.group.title]]}
      title={strings.group.edit}
    >
      <Columns
        primary={
          <>
            {alerts && <Alerts data={alerts} />}
            <Form
              form="group"
              onSubmit={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              subaction="group-edit"
              values={group}
            />
            <Table
              columns={{
                name: { label: strings.meetings.name },
                when: { label: strings.meetings.when },
                types: { label: strings.meetings.types },
                updatedAt: { label: strings.updated, align: "right" },
              }}
              rows={group.meetings.map(
                ({
                  name,
                  id,
                  updatedAt,
                  day,
                  languages,
                  time,
                  timezone,
                  types,
                }: Meeting & { languages: Language[]; types: Type[] }) => ({
                  name,
                  id,
                  link: `/meetings/${id}`,
                  types: [...languages, ...types].map(({ code }) => code),
                  updatedAt: formatDate(updatedAt.toString()),
                  when: formatDayTime(day, time, timezone),
                })
              )}
            />
            <div className="flex justify-center pt-4">
              <Button url={`/groups/${group.id}/add`} theme="secondary">
                {strings.meetings.add}
              </Button>
            </div>
          </>
        }
      >
        <Panel
          add={{
            subaction: "group-rep-add",
          }}
          emptyText={strings.representatives.empty}
          title={strings.representatives.title}
          rows={users.map((user: User & { groups: Group[] }) => ({
            date: user.lastSeen?.toString(),
            edit: {
              form: "group-rep-edit",
              subaction: "group-rep-edit",
              values: user,
            },
            remove: {
              subaction: "group-rep-remove",
              targetID: user.id,
            },
            text: `${user.name} • ${user.email}`,
            user,
          }))}
        />
        <Panel
          emptyText={strings.activity.empty}
          title={strings.activity.title}
          rows={activities.map(
            ({
              approved,
              changes,
              createdAt,
              id,
              type,
              user,
            }: Activity & { changes: Change[]; user: User }) => ({
              date: createdAt.toString(),
              link: `/activity/${id}`,
              text: formatString(
                strings.activity.general[
                  type as keyof typeof strings.activity.general
                ],
                formatActivity({ type: "group", approved, changes })
              ),
              user,
            })
          )}
        />
      </Columns>
    </Template>
  );
}

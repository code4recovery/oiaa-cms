import md5 from "blueimp-md5";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { validationError } from "remix-validated-form";

import { Alerts, Form, Template } from "~/components";
import { formatToken, formatValidator } from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";
import { db, sendMail } from "~/utils";

export const action: ActionFunction = async ({ request }) => {
  const validator = formatValidator("user");
  const { data, error } = await validator.validate(await request.formData());
  if (error) {
    return validationError(error);
  }
  const { name, email, currentAccountID } = data;

  const emailHash = md5(email);
  const loginToken = formatToken();
  await db.user.create({
    data: {
      name,
      email,
      emailHash,
      loginToken,
      currentAccountID,
      accounts: { connect: { id: currentAccountID } },
    },
  });
  await sendMail(
    email,
    "invite",
    request,
    `/auth/${emailHash}/${loginToken}`,
    currentAccountID
  );
  return json({ success: strings.users.added });
};

export default function User() {
  const { currentAccountID } = useUser();
  const actionData = useActionData();
  return (
    <Template
      title={strings.users.add}
      breadcrumbs={[["/users", strings.users.title]]}
    >
      {actionData && <Alerts data={actionData} />}
      <Form
        title={strings.users.title}
        description={strings.users.description}
        form="user"
        values={{ currentAccountID }}
      />
    </Template>
  );
}

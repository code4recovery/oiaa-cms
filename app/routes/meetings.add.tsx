import type { ActionArgs, MetaFunction } from "@remix-run/node";

import { Form, Template } from "~/components";
import { config } from "~/helpers";
import { strings } from "~/i18n";

export const action = async ({ params }: ActionArgs) => {
  console.log(params.meetingId);
};

export const meta: MetaFunction = () => ({
  title: strings.meetings_title,
});

export default function CreateMeeting() {
  return (
    <Template title={strings.meetings_add}>
      <Form
        title={strings.meetings_details}
        description={strings.meetings_details_description}
        fields={config.meetingFields}
      />
    </Template>
  );
}

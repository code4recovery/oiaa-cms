import { useEffect, useState } from "react";
import type { Group, Meeting } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import md5 from "blueimp-md5";
import { validationError } from "remix-validated-form";

import { Alerts, Button, Select } from "~/components";
import {
  config,
  formatSearch,
  formatString,
  formatToken,
  formatValidator,
} from "~/helpers";
import { strings } from "~/i18n";
import { db, getIDs, sendMail } from "~/utils";

const classes = {
  input:
    "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-600 rounded w-full sm:text-sm sm:leading-6 placeholder:text-neutral-500 focus:ring-indigo-500 focus:border-indigo-500",
  help: "text-sm text-neutral-500",
  label: "block text-sm font-medium leading-6",
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // todo tech debt - get account somehow
  const account = await db.account.findFirst({ select: { id: true } });
  if (!account) {
    throw new Error("No account found");
  }

  if (formData.get("subaction") === "user-login") {
    const validator = formatValidator("login");

    const { data, error } = await validator.validate(formData);

    if (error) {
      return validationError(error);
    }

    const { email } = data;

    let user = await db.user.findUnique({
      select: { id: true, emailHash: true, currentAccountID: true },
      where: { email },
    });

    const loginToken = formatToken();

    if (user) {
      await db.user.update({
        data: { loginToken },
        where: { id: user.id },
      });
    } else {
      const emailHash = md5(email);
      user = await db.user.create({
        data: {
          email,
          emailHash,
          loginToken,
          name: "",
          currentAccountID: account.id,
        },
      });
    }

    try {
      const buttonLink = `/auth/${user.emailHash}/${loginToken}?go=/request`;
      await sendMail({
        buttonLink,
        buttonText: strings.email.login.buttonText,
        currentAccountID: user.currentAccountID,
        headline: formatString(strings.email.login.headline, { email }),
        instructions: strings.email.login.instructions,
        request,
        subject: strings.email.login.subject,
        to: email,
      });
    } catch (e) {
      if (e instanceof Error) {
        return json({ error: e.message });
      }
    }

    return json({ info: strings.request.email_sent });
  } else if (formData.get("subaction") === "group-search") {
    const search = formData.get("group-search");

    if (search) {
      const result = await db.group.findRaw({
        filter: {
          $text: {
            $search: formatSearch(search),
          },
          accountID: { $oid: account.id },
        },
      });

      if (!Array.isArray(result) || !result.length) {
        return [];
      }

      return json(result);
    }
  } else if (formData.get("subaction") === "request") {
    const recordID = formData.get("groupID")?.toString() ?? "";
    const group = await db.group.findFirstOrThrow({
      where: { accountID: account.id, recordID },
      include: { users: true },
    });
    const userID = formData.get("userID")?.toString() ?? "";
    const user = await db.user.findUniqueOrThrow({ where: { id: userID } });

    // send email to group reps
    group.users.forEach(async (rep) => {
      sendMail({
        buttonLink: `/approve/${rep.emailHash}/${group.id}/${user.id}`,
        buttonText: strings.email.request.buttonText,
        currentAccountID: account.id,
        headline: formatString(strings.email.request.headline, {
          name: user.name,
          group: group.name,
        }),
        instructions: strings.email.request.instructions,
        request,
        subject: strings.email.request.subject,
        to: rep.email,
      });
    });

    return json({ info: strings.request.request_sent });
  }
  return null;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = await getIDs(request);
  const user = id
    ? await db.user.findUnique({
        select: { id: true, email: true, name: true, groups: true },
        where: { id },
      })
    : undefined;

  const group = params.recordID
    ? await db.group.findFirst({
        include: {
          meetings: {
            orderBy: [{ day: "asc" }, { time: "asc" }],
          },
        },
        where: { recordID: params.recordID },
      })
    : undefined;

  const meeting = params.slug
    ? await db.meeting.findFirst({
        where: { slug: params.slug },
      })
    : undefined;

  return json({ group, meeting, user });
};

export default function Request() {
  const { user, group, meeting } = useLoaderData();
  const [groupExists, setGroupExists] = useState(true);
  const [groupRecordID, setGroupRecordID] = useState(group?.recordID);
  const [meetingSlug, setMeetingSlug] = useState(meeting?.slug);
  const [requestID, setRequestID] = useState("");
  const actionData = useActionData();
  const groupFetcher = useFetcher();
  const requestFetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    const url = ["/request", groupRecordID, meetingSlug]
      .filter(Boolean)
      .join("/");
    navigate(url, { preventScrollReset: true });
  }, [groupRecordID, meetingSlug, navigate]);

  return (
    <div className="p-5 max-w-5xl w-full mx-auto">
      <h1 className="font-semibold text-xl block w-full text-center my-7 xl:my-10 xl:text-3xl">
        New Meeting / Change Request Form
      </h1>

      {actionData && <Alerts data={actionData} />}

      <Form method="post">
        <input type="hidden" name="subaction" value="user-login" />
        <Fieldset
          description="Please start by confirming your identity. We will keep your contact info confidential."
          title="1. Hi there 👋"
        >
          <Field
            help="We will never share your email address."
            label="Your email address"
            name="email"
          >
            <div className="relative">
              <input
                autoFocus={!user}
                className={classes.input}
                disabled={!!user}
                id="email"
                name="email"
                readOnly={!!user}
                type="email"
                value={user?.email}
              />
              {!!user && (
                <Button
                  className="absolute px-2 text-sm top-1 right-1 bottom-1 rounded bg-pink"
                  theme="primary"
                  url="/auth/out?go=/request"
                >
                  Sign out
                </Button>
              )}
            </div>
          </Field>
          {user ? (
            <Field
              help="It's ok to use a last initial. Your name may be seen by other members of your group, if they request updates."
              label="Your name"
              name="your_name"
            >
              <input
                className={classes.input}
                defaultValue={user?.name}
                id="your_name"
                name="your_name"
                type="text"
              />
            </Field>
          ) : (
            <Button theme="primary">Confirm your identity</Button>
          )}
        </Fieldset>
      </Form>

      {user && (
        <>
          <Fieldset
            title="2. Group selection"
            description="Groups are responsible for meeting listings on the website. The groups you have been added to will appear here."
          >
            {user.groups.map((group: Group) => (
              <label
                key={group.id}
                className="flex gap-3 items-center cursor-pointer"
              >
                <input
                  checked={groupRecordID === group.recordID}
                  className="rounded"
                  onChange={() =>
                    setGroupRecordID(
                      groupRecordID === group.recordID
                        ? undefined
                        : group.recordID
                    )
                  }
                  readOnly
                  type="checkbox"
                />
                {group.name} ({group.recordID})
              </label>
            ))}

            {!user.groups.length && (
              <div className="text-sm">
                Your email address ({user.email}) is not currently associated
                with a group in our system.
              </div>
            )}

            {!groupRecordID && (
              <Field
                label="Does your group list meetings on the website now?"
                name="group"
              >
                {[
                  { exists: true, label: "Yes" },
                  { exists: false, label: "No" },
                ].map(({ exists, label }) => (
                  <label
                    key={label}
                    className="flex gap-2 items-center cursor-pointer"
                  >
                    <input
                      checked={groupExists === exists}
                      name="group-exists"
                      onChange={() => setGroupExists(exists)}
                      type="radio"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </Field>
            )}
            {!groupRecordID && groupExists && (
              <>
                <groupFetcher.Form method="post">
                  <input type="hidden" name="subaction" value="group-search" />
                  <Field label="Find my group" name="search">
                    <input
                      className={classes.input}
                      id="group-search"
                      name="group-search"
                      type="search"
                    />
                  </Field>
                </groupFetcher.Form>
                {groupFetcher.state === "loading" ? (
                  <div className="text-sm">Searching...</div>
                ) : groupFetcher.data?.length === 0 ? (
                  <div className="text-sm">No results</div>
                ) : groupFetcher.data ? (
                  <div className="grid gap-2">
                    {groupFetcher.data.map((group: Group) => (
                      <label
                        className="flex gap-2 items-center cursor-pointer"
                        key={group.id}
                      >
                        <input
                          checked={requestID === group.recordID}
                          name="group-id"
                          onChange={() => setRequestID(group.recordID || "")}
                          type="radio"
                        />
                        <span className="text-sm">
                          {group.name} ({group.recordID})
                        </span>
                      </label>
                    ))}
                  </div>
                ) : null}
              </>
            )}
            {requestID && (
              <>
                <requestFetcher.Form className="grid gap-2" method="post">
                  <input type="hidden" name="subaction" value="request" />
                  <input type="hidden" name="groupID" value={requestID} />
                  <input type="hidden" name="userID" value={user.id} />
                  <Button theme="primary">Request to be added</Button>
                  <p className="text-sm">
                    This will send a request to the current group
                    representatives.
                  </p>
                </requestFetcher.Form>
                {requestFetcher.data && (
                  <div className="text-red-400">
                    <Alerts data={requestFetcher.data} />
                  </div>
                )}
              </>
            )}
          </Fieldset>

          {(!groupExists || groupRecordID) && (
            <Form method="post">
              <Fieldset
                title="3. Group Information"
                description="Now tell us about your group. This information is included on each meeting listing."
              >
                <Field label="Group name" name="group">
                  <input
                    className={classes.input}
                    defaultValue={group?.name}
                    id="group"
                    name="group"
                    type="text"
                  />
                </Field>
                <Field
                  help="Optional link to your group website. If your group does not have a website, please leave this section blank. (This should not be a zoom URL, that comes next.)"
                  label="Group website, if any"
                  name="website"
                >
                  <input
                    className={classes.input}
                    defaultValue={group?.website}
                    id="website"
                    name="website"
                    placeholder="https://"
                    type="url"
                  />
                </Field>
                <Field
                  help="Optional group email address. This will be displayed publicly on the meeting listing."
                  label="Group email, if any"
                  name="email"
                >
                  <input
                    className={classes.input}
                    defaultValue={group?.email}
                    id="email"
                    name="email"
                    placeholder="group.name@email.com"
                    type="email"
                  />
                </Field>
                <Field
                  help="This should be general information about the group and not make reference to individual meetings (that will come next)."
                  label="Group notes"
                  name="group_notes"
                >
                  <textarea
                    className={classes.input}
                    defaultValue={group?.notes}
                    id="group_notes"
                    name="group_notes"
                    rows={5}
                  />
                </Field>
              </Fieldset>

              <Fieldset
                title="4. Meeting Selection"
                description="Optional: pick a meeting that you want to edit."
              >
                {group?.meetings.map((meeting: Meeting) => (
                  <label
                    key={meeting.id}
                    className="flex gap-3 items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={meetingSlug === meeting.slug}
                      readOnly
                      onChange={() =>
                        setMeetingSlug(
                          meetingSlug === meeting.slug
                            ? undefined
                            : meeting.slug
                        )
                      }
                    />
                    {meeting.name} ({meeting.day} {meeting.time})
                  </label>
                ))}
              </Fieldset>

              <Fieldset
                title="Meetings 🪑"
                description="Now tell us about your meetings."
              >
                <Field label="Meeting name" name="group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={classes.input}
                  />
                </Field>
                <Field
                  label="Does this meeting meet at a specific time?"
                  name="group"
                >
                  <label className="flex gap-2 items-center cursor-pointer">
                    <input
                      name="meeting-ongoing"
                      value="no"
                      type="radio"
                      defaultChecked={true}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex gap-2 items-center cursor-pointer">
                    <input name="meeting-ongoing" value="yes" type="radio" />
                    <span>No</span>
                  </label>
                </Field>
                <Field
                  name="time"
                  help="Leave these blank if the meeting is ongoing"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2">
                      <label className={classes.label}>Start time</label>
                      <input
                        type="time"
                        name="time"
                        id="time"
                        className={classes.input}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className={classes.label}>End time</label>
                      <input
                        type="time"
                        name="end_time"
                        id="end_time"
                        className={classes.input}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className={classes.label}>Timezone</label>
                      <Select
                        name="timezone"
                        className={classes.input}
                        options={config.timezones.map((value) => {
                          const [group, ...rest] = value.split("/");
                          const label = rest.join(" • ").split("_").join(" ");
                          return { value, label, group };
                        })}
                      />
                    </div>
                  </div>
                </Field>
                <Field label="Day(s) of the week" name="group">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="checkbox" className="rounded" />
                        <span>{day}</span>
                      </div>
                    ))}
                  </div>
                </Field>
                <Field
                  label="Conference URL"
                  name="conference_url"
                  help="Should be a URL to join a meeting directly."
                >
                  <input
                    type="url"
                    name="conference_url"
                    placeholder="https://zoom.us/j/123456789?pwd=abcdefghi123456789"
                    className={classes.input}
                  />
                </Field>
                <Field
                  label="Conference phone"
                  name="conference_phone"
                  help="Should be a phone number to join a meeting, and not contain letters."
                >
                  <input
                    type="tel"
                    name="conference_url"
                    placeholder="+16469313860,,123456789#"
                    className={classes.input}
                  />
                </Field>
                <Field
                  label="Meeting notes"
                  name="notes"
                  help="No need to mention the meeting time here."
                >
                  <textarea
                    name="notes"
                    id="notes"
                    rows={5}
                    className={classes.input}
                  />
                </Field>
              </Fieldset>

              <div className="grid gap-8 pt-8 pb-10 max-w-md text-center mx-auto">
                <p>
                  By clicking Submit I agree to the Online Intergroup of A.A.{" "}
                  <a
                    href="https://aa-intergroup.org/privacy-policy"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 underline"
                  >
                    Privacy Policy
                  </a>
                  {" and "}
                  <a
                    href="https://aa-intergroup.org/rules-of-conduct"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-500 underline"
                  >
                    Rules of Conduct
                  </a>
                  .
                </p>
                <p>
                  <input
                    type="submit"
                    value="Submit"
                    className="bg-indigo-500 rounded-md px-5 py-2 text-neutral-100 text-lg mb-3 dark:bg-indigo-300 dark:text-neutral-900"
                    disabled
                  />
                </p>
              </div>
            </Form>
          )}
        </>
      )}
    </div>
  );
}

function Field({
  children,
  label,
  name,
  help,
}: {
  children: React.ReactNode;
  label?: string;
  name: string;
  help?: string;
}) {
  return (
    <div className="grid gap-y-2">
      {label && (
        <label htmlFor={name} className={classes.label}>
          {label}
        </label>
      )}
      {children}
      {help && <p className={classes.help}>{help}</p>}
    </div>
  );
}

function Fieldset({
  children,
  title,
  description,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-neutral-300 dark:border-neutral-800 py-12 md:grid-cols-5">
      <div className=" md:col-span-2">
        <h2 className="text-base font-semibold mb-2">{title}</h2>
        <p className={classes.help}>{description}</p>
      </div>
      <div className="grid gap-x-6 gap-y-8 md:col-span-3 items-start">
        {children}
      </div>
    </fieldset>
  );
}

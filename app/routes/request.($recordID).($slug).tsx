import { useEffect, useState } from "react";
import type { Group } from "@prisma/client";
import {
  type ActionFunction,
  type DataFunctionArgs,
  json,
} from "@remix-run/node";
import { DateTime } from "luxon";

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
  formatClasses as cx,
  formatDayTime,
  formatSearch,
  formatString,
  formatToken,
  formatValidator,
} from "~/helpers";
import { strings } from "~/i18n";
import { getMeeting } from "~/models";
import { db, getIDs, optionsInUse, sendMail } from "~/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const classes = {
  help: "text-sm text-neutral-500",
  input: cx(
    config.fieldClassNames,
    config.themes.indigo.focusRing,
    "h-10 leading-7"
  ),
  label: "block text-sm font-medium leading-6",
  labelButton:
    "border border-indigo-400 cursor-pointer flex gap-3 items-center p-4 rounded hover:bg-indigo-200 dark:border-neutral-500 dark:hover:bg-neutral-800",
  labelButtonActive:
    "border border-indigo-400 cursor-pointer flex gap-3 items-center p-4 rounded bg-indigo-200 dark:border-neutral-500 dark:bg-neutral-800",
  textarea: cx(config.fieldClassNames, config.themes.indigo.focusRing),
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // todo get account somehow
  const account = await db.account.findFirst({ select: { id: true } });
  if (!account) {
    throw new Error("No account found");
  }

  if (formData.get("subaction") === "login") {
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
      const { id: userID } = await getIDs(request);

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

      // filter out meetings that the user is already a part of
      const otherMeetings = result.filter(
        (group) =>
          !group.userIDs.some(({ $oid }: { $oid: string }) => $oid === userID)
      );

      return json(otherMeetings);
    }
  } else if (formData.get("subaction") === "request") {
    const recordID = formData.get("groupID")?.toString() ?? "";
    const group = await db.group.findFirstOrThrow({
      where: { accountID: account.id, recordID },
      include: { users: true },
    });
    const { id: userID } = await getIDs(request);

    // update user name
    const name = formData.get("your_name")?.toString() || "";
    await db.user.update({
      data: { name },
      where: { id: userID },
    });

    // send email to group reps
    group.users.forEach(async ({ email, emailHash, id, loginToken }) => {
      // if loginToken is empty, add one
      if (!loginToken) {
        loginToken = formatToken();
        await db.user.update({
          data: { loginToken },
          where: { id },
        });
      }

      // form login-and-approve link
      const go = `/approve/${group.id}/${userID}`;
      const params = new URLSearchParams({ go });
      const buttonLink = `/auth/${emailHash}/${loginToken}?${params}`;

      sendMail({
        buttonLink,
        buttonText: strings.email.request.buttonText,
        currentAccountID: account.id,
        headline: formatString(strings.email.request.headline, {
          group: group.name,
          name,
        }),
        instructions: strings.email.request.instructions,
        request,
        subject: strings.email.request.subject,
        to: email,
      });
    });

    return json({ info: strings.request.request_sent });
  }
  return null;
};

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const { currentAccountID, id } = await getIDs(request);
  const user = id
    ? await db.user.findUnique({
        select: { id: true, email: true, name: true, groups: true },
        where: { id },
      })
    : undefined;

  const group = params.recordID
    ? (await db.group.findFirst({
        include: {
          meetings: {
            orderBy: [{ day: "asc" }, { time: "asc" }],
          },
        },
        where: { recordID: params.recordID },
      })) || undefined
    : undefined;

  const meetingID = params.slug
    ? await db.meeting.findFirstOrThrow({
        select: { id: true },
        where: { groupID: group?.id, slug: params.slug },
      })
    : undefined;

  const meeting = meetingID ? await getMeeting(meetingID.id) : undefined;

  const { languages, types } = await optionsInUse(currentAccountID);

  return {
    group,
    languages,
    meeting,
    types,
    user,
  };
};

export default function Request() {
  const { user, group, languages, meeting, types } =
    useLoaderData<ReturnType<typeof loader>>();
  const [groupExists, setGroupExists] = useState(true);
  const [groupRecordID, setGroupRecordID] = useState(
    group?.recordID ?? user?.groups[0]?.recordID
  );
  const [meetingSlug, setMeetingSlug] = useState(meeting?.slug);
  const [requestID, setRequestID] = useState<string | undefined>();
  const [meetingActive, setMeetingActive] = useState<"true" | "false">("true");
  const actionData = useActionData();
  const groupFetcher = useFetcher();
  const requestFetcher = useFetcher();
  const navigate = useNavigate();

  // update url when selections change
  useEffect(() => {
    const url = groupExists
      ? ["/request", groupRecordID, meetingSlug].filter(Boolean).join("/")
      : "/request";
    navigate(url, { preventScrollReset: true });
  }, [groupRecordID, meetingSlug, groupExists, navigate]);

  return (
    <div
      className="p-5 max-w-5xl w-full mx-auto pb-full"
      style={{ paddingBottom: "100vh" }} /* no scroll when content changes */
    >
      <h1 className="font-semibold text-xl sm:text-2xl block w-full text-center my-7 xl:my-10 md:text-3xl">
        {strings.request.title}
      </h1>

      {actionData && <Alerts data={actionData} />}

      <Form method="post">
        <input type="hidden" name="subaction" value="login" />
        <Fieldset
          description={strings.request.login.description}
          title={strings.request.login.title}
        >
          <Field label={strings.request.login.email} name="email">
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
                  {strings.auth.out}
                </Button>
              )}
            </div>
          </Field>
          {!user && (
            <Button theme="primary">{strings.request.login.buttonText}</Button>
          )}
        </Fieldset>
      </Form>

      {user && (
        <>
          <Fieldset
            title={strings.request.group_select.title}
            description={strings.request.group_select.description}
          >
            {user.groups?.map((group) => (
              <label
                key={group.id}
                className={
                  groupRecordID === group.recordID
                    ? classes.labelButtonActive
                    : classes.labelButton
                }
              >
                <input
                  checked={groupRecordID === group.recordID}
                  onChange={() => {
                    setGroupExists(true);
                    setRequestID(undefined);
                    setGroupRecordID(group.recordID);
                  }}
                  readOnly
                  type="radio"
                />
                <span>{group.name}</span>
                <span>~</span>
                <span>#{group.recordID}</span>
              </label>
            ))}

            <label className="grid gap-2 cursor-pointer">
              <p
                className={
                  !groupExists ? classes.labelButtonActive : classes.labelButton
                }
              >
                <input
                  checked={!groupExists}
                  name="group-exists"
                  onChange={() => {
                    setGroupExists(false);
                    setGroupRecordID(undefined);
                    setRequestID(undefined);
                  }}
                  type="radio"
                  value="false"
                />
                {strings.request.group_select.new_group}
              </p>
            </label>

            <groupFetcher.Form method="post">
              <input name="subaction" type="hidden" value="group-search" />
              <Field label="Find my existing group" name="search">
                <div className={cx(classes.input, "relative")}>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 dark:text-white">
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="h-5 w-5 text-neutral-400 dark:text-neutral-600"
                    />
                  </div>
                  <input
                    id="group-search"
                    name="group-search"
                    type="search"
                    className="absolute bg-transparent border-0 ring-0 top-0 right-0 left-7 bottom-0 focus:ring-0"
                  />
                </div>
              </Field>
            </groupFetcher.Form>

            {groupFetcher.state === "loading" ? (
              <div className="text-sm">
                {strings.request.group_select.searching}
              </div>
            ) : groupFetcher.data?.length === 0 ? (
              <div className="text-sm">
                {strings.request.group_select.no_results}
              </div>
            ) : groupFetcher.data ? (
              <>
                {groupFetcher.data.map((group: Group) => (
                  <label
                    className={
                      requestID === group.recordID
                        ? classes.labelButtonActive
                        : classes.labelButton
                    }
                    key={group.recordID}
                  >
                    <input
                      checked={requestID === group.recordID}
                      onChange={() => {
                        setGroupExists(true);
                        setGroupRecordID(undefined);
                        setRequestID(group.recordID || undefined);
                      }}
                      type="radio"
                    />
                    <span>{group.name}</span>
                    <span>~</span>
                    <span>#{group.recordID}</span>
                  </label>
                ))}
              </>
            ) : null}

            {requestID && (
              <>
                <requestFetcher.Form className="grid gap-y-8" method="post">
                  <input type="hidden" name="subaction" value="request" />
                  <input type="hidden" name="groupID" value={requestID} />
                  <Field
                    help={strings.request.group_select.your_name_help}
                    label={strings.request.group_select.your_name}
                    name="your_name"
                  >
                    <input
                      className={classes.input}
                      defaultValue={user?.name}
                      id="your_name"
                      name="your_name"
                      required={true}
                      type="text"
                    />
                  </Field>
                  <div className="grid gap-y-2">
                    <Button theme="primary">
                      {strings.request.group_select.buttonText}
                    </Button>
                    <p className="text-sm">
                      {strings.request.group_select.buttonTextHelp}
                    </p>
                  </div>
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
                description={strings.request.group_info.description}
                title={strings.request.group_info.title}
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
                  help={strings.request.group_info.website_help}
                  label={strings.request.group_info.website}
                  name="website"
                >
                  <input
                    className={classes.input}
                    defaultValue={group?.website || undefined}
                    id="website"
                    name="website"
                    placeholder="https://"
                    type="url"
                  />
                </Field>
                <Field
                  help={strings.request.group_info.email_help}
                  label={strings.request.group_info.email}
                  name="email"
                >
                  <input
                    className={classes.input}
                    defaultValue={group?.email || undefined}
                    id="email"
                    name="email"
                    placeholder={strings.request.group_info.email_placeholder}
                    type="email"
                  />
                </Field>
                <Field
                  help={strings.request.group_info.phone_help}
                  label={strings.request.group_info.phone}
                  name="phone"
                >
                  <input
                    className={classes.input}
                    defaultValue={group?.phone || undefined}
                    id="phone"
                    name="phone"
                    placeholder="+1 212 555 1212"
                    type="tel"
                  />
                </Field>
                <Field
                  help={strings.request.group_info.notes_help}
                  label={strings.request.group_info.notes}
                  name="group_notes"
                >
                  <textarea
                    className={classes.textarea}
                    defaultValue={group?.notes || undefined}
                    id="group_notes"
                    name="group_notes"
                    rows={5}
                  />
                </Field>
              </Fieldset>

              {groupExists && !!group?.meetings.length && (
                <Fieldset
                  description={strings.request.meeting_select.description}
                  title={strings.request.meeting_select.title}
                >
                  {group?.meetings.map((meeting) => (
                    <label
                      className={
                        meetingSlug === meeting.slug
                          ? classes.labelButtonActive
                          : classes.labelButton
                      }
                      key={meeting.id}
                    >
                      <input
                        checked={meetingSlug === meeting.slug}
                        onClick={() =>
                          setMeetingSlug(
                            meetingSlug === meeting.slug
                              ? undefined
                              : meeting.slug
                          )
                        }
                        readOnly
                        type="radio"
                      />
                      <span>{meeting.name}</span>
                      <span>~</span>
                      <span>
                        {formatDayTime(
                          meeting.day,
                          meeting.time,
                          meeting.timezone
                        )}
                      </span>
                    </label>
                  ))}
                  <label
                    className={
                      meetingSlug === ""
                        ? classes.labelButtonActive
                        : classes.labelButton
                    }
                  >
                    <input
                      checked={meetingSlug === ""}
                      onClick={() =>
                        setMeetingSlug(meetingSlug === "" ? undefined : "")
                      }
                      readOnly
                      type="radio"
                    />
                    {strings.request.meeting_select.new_meeting}
                  </label>
                </Fieldset>
              )}

              {typeof meetingSlug === "string" && (
                <Fieldset
                  description={strings.request.meeting.description}
                  title={strings.request.meeting.title}
                >
                  {meetingSlug && (
                    <Field label={strings.request.meeting.active} name="active">
                      <select
                        name="active"
                        value={meetingActive}
                        onChange={(e) =>
                          setMeetingActive(
                            e.target.value as typeof meetingActive
                          )
                        }
                        className={classes.input}
                      >
                        <option value="true">{strings.yes}</option>
                        <option value="false">{strings.no}</option>
                      </select>
                    </Field>
                  )}
                  {meetingActive === "true" && (
                    <>
                      <Field
                        help={strings.request.meeting.name_help}
                        label={strings.request.meeting.name}
                        name="name"
                      >
                        <input
                          className={classes.input}
                          defaultValue={meeting?.name}
                          id="name"
                          name="name"
                          type="text"
                        />
                      </Field>
                      <Field
                        name="time"
                        help={strings.request.meeting.time_help}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-2">
                            <label className={classes.label}>
                              {strings.request.meeting.time}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={meeting?.time || undefined}
                              id="time"
                              name="time"
                              type="time"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className={classes.label}>
                              {strings.request.meeting.duration}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={meeting?.duration || undefined}
                              id="duration"
                              name="duration"
                              type="number"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className={classes.label}>
                              {strings.request.meeting.timezone}
                            </label>
                            <Select
                              className={classes.input}
                              defaultValue={
                                meeting?.timezone || DateTime.local().zoneName
                              }
                              name="timezone"
                              options={config.timezones.map((value) => {
                                const [group, ...rest] = value.split("/");
                                const label = rest
                                  .join(" • ")
                                  .split("_")
                                  .join(" ");
                                return { value, label, group };
                              })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-5 mb-3">
                          {config.days.map((day, i) => (
                            <label
                              key={i}
                              className="flex gap-2 items-center cursor-pointer text-sm"
                            >
                              <input
                                className="rounded"
                                defaultChecked={meeting?.day === i}
                                type="checkbox"
                                value={i}
                              />
                              {strings.days[day as keyof typeof strings.days]}
                            </label>
                          ))}
                        </div>
                      </Field>

                      <Field
                        name="conference_url"
                        help={strings.request.meeting.conference_url_help}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-2 col-span-2">
                            <label className={classes.label}>
                              {strings.request.meeting.conference_url}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={
                                meeting?.conference_url || undefined
                              }
                              id="conference_url"
                              name="conference_url"
                              placeholder="https://zoom.us/j/123456789?pwd=abcdefghijk123456789"
                              type="url"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className={classes.label}>
                              {strings.request.meeting.conference_url_notes}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={
                                meeting?.conference_url_notes || undefined
                              }
                              id="conference_url_notes"
                              name="conference_url_notes"
                              placeholder={
                                strings.request.meeting
                                  .conference_url_notes_placeholder
                              }
                              type="text"
                            />
                          </div>
                        </div>
                      </Field>
                      <Field
                        name="conference_phone"
                        help={strings.request.meeting.conference_phone_help}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          <div className="grid gap-2 col-span-2">
                            <label className={classes.label}>
                              {strings.request.meeting.conference_phone}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={
                                meeting?.conference_phone || undefined
                              }
                              id="conference_phone"
                              name="conference_phone"
                              placeholder="+16469313860,,123456789#"
                              type="tel"
                            />
                          </div>
                          <div className="grid gap-2">
                            <label className={classes.label}>
                              {strings.request.meeting.conference_phone_notes}
                            </label>
                            <input
                              className={classes.input}
                              defaultValue={
                                meeting?.conference_phone || undefined
                              }
                              id="conference_phone_notes"
                              name="conference_phone_notes"
                              type="text"
                            />
                          </div>
                        </div>
                      </Field>
                      <Field
                        label={strings.request.meeting.types}
                        help={strings.request.meeting.types_help}
                      >
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {types
                            .sort((a, b) =>
                              strings.types[
                                a as keyof typeof strings.types
                              ].localeCompare(
                                strings.types[b as keyof typeof strings.types]
                              )
                            )
                            .map((type, i) => (
                              <label
                                key={i}
                                className="flex gap-2 items-center cursor-pointer text-sm"
                              >
                                <input
                                  className="rounded"
                                  defaultChecked={meeting?.types.includes(type)}
                                  type="checkbox"
                                  value={i}
                                />
                                {
                                  strings.types[
                                    type as keyof typeof strings.types
                                  ]
                                }
                              </label>
                            ))}
                        </div>
                      </Field>
                      <Field
                        label={strings.request.meeting.languages}
                        help={strings.request.meeting.languages_help}
                      >
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {languages
                            .sort((a, b) =>
                              strings.languages[
                                a as keyof typeof strings.languages
                              ].localeCompare(
                                strings.languages[
                                  b as keyof typeof strings.languages
                                ]
                              )
                            )
                            .map((language, i) => (
                              <label
                                key={i}
                                className="flex gap-2 items-center cursor-pointer text-sm"
                              >
                                <input
                                  className="rounded"
                                  defaultChecked={meeting?.languages.includes(
                                    language
                                  )}
                                  type="checkbox"
                                  value={i}
                                />
                                {
                                  strings.languages[
                                    language as keyof typeof strings.languages
                                  ]
                                }
                              </label>
                            ))}
                        </div>
                      </Field>
                      <Field
                        help={strings.request.meeting.notes_help}
                        label={strings.request.meeting.notes}
                        name="notes"
                      >
                        <textarea
                          className={classes.textarea}
                          defaultValue={meeting?.notes || undefined}
                          id="notes"
                          name="notes"
                          rows={5}
                        />
                      </Field>
                    </>
                  )}
                </Fieldset>
              )}

              <div className="grid gap-y-10 pt-8 pb-10 max-w-md text-center mx-auto">
                <div className="grid gap-3">
                  <p>{strings.request.agree}</p>
                  <nav className="flex gap-x-3 justify-center">
                    <a
                      className="text-indigo-500 dark:text-indigo-400 underline"
                      href="https://aa-intergroup.org/privacy-policy"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {strings.request.privacy_policy}
                    </a>
                    <span>~</span>
                    <a
                      className="text-indigo-500 dark:text-indigo-400 underline"
                      href="https://aa-intergroup.org/directory-guidelines"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {strings.request.directory_guidelines}
                    </a>
                  </nav>
                </div>
                <div>
                  <input
                    className="bg-indigo-500 rounded-md px-5 py-2 text-neutral-100 text-lg dark:bg-indigo-300 dark:text-neutral-900"
                    disabled
                    type="submit"
                    value={strings.request.submit}
                  />
                </div>
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
  name?: string;
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
  description,
  title,
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <fieldset className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-neutral-300 dark:border-neutral-800 py-12 md:grid-cols-6">
      <div className=" md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {description && <p className={classes.help}>{description}</p>}
      </div>
      <div className="grid gap-x-6 gap-y-8 md:col-span-4 items-start">
        {children}
      </div>
    </fieldset>
  );
}

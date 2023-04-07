import { useNavigation } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";

import { Button, Checkbox, Input, Label, Textarea } from "~/components";
import {
  config,
  fields,
  formatClasses as cx,
  formatValidator,
} from "~/helpers";
import { useUser } from "~/hooks";
import { strings } from "~/i18n";

export function Form({
  title,
  description,
  form,
  values,
  isAdmin,
}: {
  title?: string;
  description?: string;
  form: keyof typeof fields;
  values?: { [key: string]: string | string[] };
  isAdmin?: boolean;
}) {
  const {
    theme: { focusRing, text },
  } = useUser();
  const { state } = useNavigation();
  const submitting = state !== "idle";
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          {title && (
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-5 md:col-span-2 md:mt-0">
        <ValidatedForm
          autoComplete="off"
          method="post"
          validator={formatValidator(form)}
        >
          <fieldset disabled={submitting}>
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                <div className="grid grid-cols-12 gap-5">
                  {Object.keys(fields[form])
                    .filter((name) => !fields[form][name].adminOnly || isAdmin)
                    .map((name) => {
                      const {
                        className,
                        label,
                        options,
                        placeholder,
                        required,
                        span,
                        type,
                      } = fields[form][name];
                      return type === "hidden" ? (
                        <input
                          type="hidden"
                          name={name}
                          key={name}
                          value={values?.[name]}
                        />
                      ) : (
                        <div
                          className={cx("col-span-12", {
                            "sm:col-span-1": span === 1,
                            "sm:col-span-2": span === 2,
                            "sm:col-span-3": span === 3,
                            "sm:col-span-4": span === 4,
                            "sm:col-span-5": span === 5,
                            "sm:col-span-6": span === 6,
                            "sm:col-span-7": span === 7,
                            "sm:col-span-8": span === 8,
                            "sm:col-span-9": span === 9,
                            "sm:col-span-10": span === 10,
                            "sm:col-span-11": span === 11,
                          })}
                          key={name}
                        >
                          <Label htmlFor={name}>{label}</Label>
                          {[
                            "email",
                            "number",
                            "tel",
                            "text",
                            "time",
                            "url",
                          ].includes(type) && (
                            <Input
                              {...fields[form][name]}
                              defaultValue={values?.[name]}
                              name={name}
                            />
                          )}
                          {type === "textarea" && (
                            <Textarea
                              defaultValue={values?.[name]}
                              name={name}
                            />
                          )}
                          {type === "colors" && (
                            <div className="grid grid-cols-5 gap-2 items-top">
                              {Object.keys(config.themes).map((color) => {
                                const {
                                  background,
                                  backgroundHover,
                                  focusRing,
                                  label,
                                  text,
                                } =
                                  config.themes[
                                    color as keyof typeof config.themes
                                  ];
                                return (
                                  <input
                                    key={color}
                                    type="radio"
                                    name={name}
                                    value={color}
                                    defaultChecked={color === values?.[name]}
                                    className={cx(
                                      "relative h-10 flex cursor-pointer justify-center rounded w-full border-0 checked:ring-2 checked:ring-offset-1",
                                      background,
                                      backgroundHover,
                                      className,
                                      focusRing,
                                      text
                                    )}
                                    aria-label={label}
                                  />
                                );
                              })}
                            </div>
                          )}
                          {type === "select" && (
                            <select
                              name={name}
                              id={name}
                              className={cx(
                                config.fieldClassNames,
                                focusRing,
                                className
                              )}
                              defaultValue={
                                values?.[name] !== null
                                  ? `${values?.[name]}`
                                  : undefined
                              }
                            >
                              {!required && <option></option>}
                              {options?.map(({ value: optionValue, label }) => (
                                <option
                                  key={optionValue}
                                  value={`${optionValue}`}
                                >
                                  {label}
                                </option>
                              ))}
                            </select>
                          )}
                          {type === "checkbox" && (
                            <Checkbox
                              {...fields[form][name]}
                              name={name}
                              defaultChecked={values?.[name]}
                            />
                          )}
                          {type === "checkboxes" && (
                            <div className="items-start gap-x-5 gap-y-3 grid grid-cols-3 sm:grid-cols-4">
                              {options?.map(({ value: optionValue, label }) => (
                                <div
                                  className="flex items-top gap-2 m-0"
                                  key={optionValue}
                                >
                                  <input
                                    className={cx(
                                      config.checkboxClassNames,
                                      focusRing,
                                      text,
                                      className
                                    )}
                                    defaultChecked={
                                      Array.isArray(values?.[name]) &&
                                      values?.[name]?.includes(optionValue)
                                    }
                                    id={`${optionValue}`}
                                    name={name}
                                    type="checkbox"
                                    value={`${optionValue}`}
                                  />
                                  <label
                                    className="text-sm truncate"
                                    htmlFor={`${optionValue}`}
                                    title={label}
                                  >
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end sm:px-6">
                <Button
                  label={submitting ? strings.form.saving : strings.form.save}
                />
              </div>
            </div>
          </fieldset>
        </ValidatedForm>
      </div>
    </div>
  );
}

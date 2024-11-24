"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import { ClientFormState } from "@/app/lib/actions";
import LabelBox from "./label-box";
import { PencilIcon } from "@heroicons/react/24/outline";
import ValidationErrorBox from "./validation-error-box";

export default function SharedForm({
  client,
  users,
  formAction,
  state,
}: {
  client?: ClientDetails;
  users: User[];
  formAction: (formData: FormData) => void;
  state: ClientFormState;
}) {
  const user = users.find((u) => u.id === client?.user_id);

  return (
    <form action={formAction} contentEditable={false}>
      <div
        className={`rounded-md bg-gray-50 md:p-2 placeholder:text-gray-500 text-black`}
      >
        {/* User */}
        <div className="mb-1 flex flex-row">
          <div className="grow">
            <LabelBox field="user" text="Main Contact" />
            <div className="relative">
              <select
                id="user"
                name="userId"
                className="w-full rounded-md border border-gray-200 py-1 pl-10 text-sm outline-2"
                defaultValue={client?.user_id}
                aria-describedby="customer-error"
              >
                <option value="" disabled>
                  Select a person
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>

            <ValidationErrorBox errors={state.errors?.userId} />
          </div>
        </div>

        {/* Contact */}
        <div className="mb-1 w-full">
          <div className="grow">
            <LabelBox field="primarypersonname" text="Name" />
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="primarypersonname"
                  name="primarypersonname"
                  type="text"
                  defaultValue={client?.primarypersonname}
                  placeholder="Enter name"
                  className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 "
                  aria-describedby="amount-error"
                />
              </div>
            </div>
            <ValidationErrorBox errors={state.errors?.primarypersonname} />
          </div>
          <div className="grow">
            <LabelBox field="primarypersonemail" text="Email" />
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="primarypersonemail"
                  name="primarypersonemail"
                  type="email"
                  defaultValue={client?.primarypersonemail}
                  placeholder="Enter email address"
                  className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 "
                />
              </div>
            </div>
            <ValidationErrorBox errors={state.errors?.primarypersonemail} />
          </div>
          <div className="grow">
            <LabelBox field="primarypersonphone" text="Phone" />
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="primarypersonphone"
                  name="primarypersonphone"
                  type="text"
                  defaultValue={client?.primarypersonphone}
                  placeholder="Enter phone number"
                  className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 "
                />
              </div>
            </div>
            <ValidationErrorBox errors={state.errors?.primarypersonphone} />
          </div>
        </div>

        {/* Notes */}
        <div className="mb-1">
          <LabelBox field="notes" text="Notes" />
          <div className="relative">
            <textarea
              id="notes"
              name="notes"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 "
              defaultValue={client?.notes}
              placeholder="Enter notes"
            />
          </div>
          <ValidationErrorBox errors={state.errors?.notes} />
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && state.errors && (
            <p className="my-2 text-sm text-red-500">{state.message}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
}

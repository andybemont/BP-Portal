"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { deleteTemplate } from "@/app/lib/template-actions";

export default function TemplateDeleteModal({
  user,
  template,
  show,
  handleClose,
}: {
  user?: User;
  template?: EmailTemplate;
  show: boolean;
  handleClose: () => void;
}) {
  return (
    show &&
    template && (
      <form>
        <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-screen w-screen flex items-center justify-center">
          <div className="m-1 border border-red-600 w-full shadow-lg rounded-md bg-white max-w-[600px]">
            <div className="text-center">
              <h1 className="text-3xl w-full border-b-2 border-black text-red-600">
                Delete Template?
              </h1>
              <div className="m-0 p-0">
                {`Are you absolutely sure you want to delete ${user?.name}'s '${template.title}' template?`}
              </div>
              <div className="flex justify-center my-2">
                <button
                  onClick={() => handleClose}
                  className="px-4 mx-1 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteTemplate(template)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Do it!
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  );
}
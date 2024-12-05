"use client";
import { CalendarEntry } from "@/app/lib/definitions";
import { useState } from "react";
import { userNamesByIds } from "@/app/lib/client-helpers";
import BlockedTimeAddEditModal from "./blocked-time-add-edit-modal";
import { useRouter } from "next/navigation";

export default function BlockedTimeEntry({ e }: { e: CalendarEntry }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const onClose = (changeMade: boolean) => {
    setShowEditModal(false);
    if (changeMade) {
      router.replace("/home");
    }
  };

  return (
    <>
      <BlockedTimeAddEditModal
        blockedTimeToEdit={e}
        show={showEditModal}
        handleClose={onClose}
      />
      <div
        onClick={() => setShowEditModal(true)}
        key={e.blockedtime_id}
        className={`cursor-pointer w-full text-sm rounded-md mb-2 p-1 font-medium border border-black/50 flex flex-row bg-darkblue text-white`}
      >
        <p className="">
          {`${e.date?.toLocaleDateString()} - ${e.end_date?.toLocaleDateString()}: ${
            e.text
          } (${userNamesByIds([e.user_id, e.seconduser_id, e.thirduser_id])})`}
        </p>
      </div>
    </>
  );
}

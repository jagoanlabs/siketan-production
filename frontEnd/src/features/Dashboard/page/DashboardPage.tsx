import { useState } from "react";

import { Navbar } from "@/components/NavBar";
import { Hero } from "@/features/Home/components/Hero";
import HomeLayout from "@/layouts/HomeLayout";
import { ChatPanel } from "@/features/Home/components/ChatPanel";

export const DashboardPage = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <HomeLayout>
        {showChat && (
          <ChatPanel setShowChat={setShowChat} showChat={showChat} />
        )}
        <Navbar index={0} />
        <Hero />
        {/* <div className="fixed z-30 bottom-6 right-6">
          <Button
            className="flex items-center justify-center gap-2 text-white shadow-lg bg-linear-to-tr from-green-400 to-green-500"
            radius="full"
            onPress={() => setShowChat(true)}
          >
            Chat Admin
            <BiMessageDetail size={20} />
          </Button>
        </div> */}
      </HomeLayout>
    </>
  );
};

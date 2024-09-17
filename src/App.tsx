import { Chat } from "@/Chat/Chat";
import { ChatIntro } from "@/Chat/ChatIntro";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Map } from "./map/Map";
import { useState } from "react";

export default function App() {
  const user = useQuery(api.users.viewer);
  const [isMapView, changeMapView] = useState<boolean>(false);
  console.log(user)
  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu changeView={changeMapView}>{user?.name ?? user?.email}</UserMenu>

        </Authenticated>
      }
    >
      <>
        <Authenticated>

          {
            isMapView ?
              <Map /> :
              <div className="switch-to-chat" style={{ overflowY: "scroll" }}>
                <ChatIntro />
                <Chat viewer={(user ?? {})._id!} />
              </div>
          }

        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}

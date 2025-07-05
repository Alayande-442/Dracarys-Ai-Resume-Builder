import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";
export const metadata: Metadata = {
  title: "Design resume",
};
export default function Page() {
  return <ResumeEditor />;
}


import { Inter } from "next/font/google";
import TaskMain from "@/components/TaskMain";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div style={{minHeight:"100vh",backgroundColor:"aliceblue"}}>
      <TaskMain/>
    </div>
  );
}

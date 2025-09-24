import { PostList } from "@/components/post";
import { AnimatedBanner } from "@/components/home/AnimatedBanner";

export default function HomePage() {
  return (
    <>
      <AnimatedBanner />
      <PostList />
    </>
  );
}

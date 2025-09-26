import { getAllPostsWithAuthors } from "@/lib/posts";
import { Sidebar } from "./Sidebar";
import { PostListClient } from "./PostListClient";

export async function PostList() {
    const posts = await getAllPostsWithAuthors();

    return (
        <div className="flex flex-col lg:flex-row w-full gap-0 lg:gap-8 overflow-hidden px-4 xl:px-2">
            {/* 메인 콘텐츠 - 약 75% */}
            <div className="flex-1 lg:flex-[3] min-w-0">
                <PostListClient initialPosts={posts} />
            </div>

            {/* 세로 구분선 - 데스크톱에서만 표시 */}
            <div className="hidden lg:block w-px flex-shrink-0" style={{backgroundColor: "rgba(0, 27, 55, .1)"}}/>

            {/* 사이드바 - 약 25% */}
            <div className="hidden lg:block lg:flex-1 lg:max-w-sm min-w-0">
                <Sidebar posts={posts}/>
            </div>
        </div>
    );
}
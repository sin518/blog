import React from "react";

export default function Header({ about }: { about?: string }) {
  return (
    <div className="w-full flex flex-col p-16 justify-center text-white container mx-auto rounded-md items-center gap-1 text-center bg-linear-to-r from-blue-500 to-purple-500 shadow-lg">
      <h1 className="text-xl md:text-2xl font-semibold">
        最新消息、实用技巧与深度见解
        <br />
        {about ? `关于${about}` : "尽在这里！"}
      </h1>
      <p className=" text-xs">
        {" "}
        在这里，您将随时获取最新资讯，深入了解科技、 <br />
        人工智能趋势及软件动态。保持信息同步！
      </p>
    </div>
  );
}

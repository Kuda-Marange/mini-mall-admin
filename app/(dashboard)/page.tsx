import Image from "next/image";

export default function Home() {
  return (
   <div className="flex flex-col justify-center items-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">This is the Home Page. Full app coming next week! </h1>
      <p className="text-muted-foreground">Navigate to /orders to see the orders page</p>
   </div> 
      
  );
}

import { Stack } from "expo-router";
import { initDB } from "@/db/db";
import { useEffect } from "react";

export default function RootLayout() {
useEffect(()=>{
  initDB()
},[])

  return <Stack screenOptions={{
    headerShown:false
  }}/>;
}

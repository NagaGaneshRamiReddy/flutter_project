import { io } from "socket.io-client";

const socket = io("http://localhost:5003", {
    transports: ["websocket"],
    auth: {
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImVtYWlsIjoidGVzdFVzZXJfNTI1NDlAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImFnZSI6MjUsImdyb3VwIjoiQ09MTEVHRV9TVFVERU5UUyIsImlzT25ib2FyZGVkIjp0cnVlLCJpYXQiOjE3NzA1MzA2MjUsImV4cCI6MTc3MTM5NDYyNX0.N2xn5b_m5SkytefJy_2oMbe4020AkqFuggHiyKhpS78",
    },
});

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});

socket.onAny((event, data) => {
    console.log("📨", event, data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});

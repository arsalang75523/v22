"use client";

import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";

type GameState = {
  territories: (string | null)[]; // آرایه‌ای که مالک هر منطقه را نشان می‌دهد
  players: string[]; // لیست بازیکنان
  currentTurn: string; // بازیکنی که نوبتش است
};

export default function StrategyGame({
  title = "بازی استراتژی آنلاین",
}: {
  title?: string;
}) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null); // مشخص کردن نوع کاربر
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const loadSDK = async () => {
      const context = await sdk.context;
      setUser(context.user as { username: string }); // تبدیل نوع داده به کاربری که نام کاربری دارد
      setIsSDKLoaded(true);
    };

    if (!isSDKLoaded) {
      loadSDK();
    }
  }, [isSDKLoaded]);

  const startGame = useCallback(() => {
    const newGameState: GameState = {
      territories: Array(10).fill(null), // 10 منطقه
      players: [user!.username], // بازیکن اول
      currentTurn: user!.username, // اولین نوبت
    };
    setGameState(newGameState);
  }, [user]);

  const takeTurn = useCallback(
    (territoryIndex: number) => {
      if (!gameState || gameState.currentTurn !== user!.username) {
        alert("نوبت شما نیست!");
        return;
      }

      setGameState((prevState) => {
        if (!prevState) return prevState;

        const newTerritories = [...prevState.territories];
        newTerritories[territoryIndex] = user!.username;

        const nextPlayerIndex =
          (prevState.players.indexOf(user!.username) + 1) %
          prevState.players.length;

        return {
          ...prevState,
          territories: newTerritories,
          currentTurn: prevState.players[nextPlayerIndex],
        };
      });
    },
    [gameState, user]
  );

  if (!isSDKLoaded) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="w-[400px] mx-auto py-4">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      {!gameState && (
        <button onClick={startGame} className="mb-4 px-4 py-2 bg-blue-500 text-white">
          شروع بازی جدید
        </button>
      )}
      {gameState && (
        <div>
          <p>نوبت: {gameState.currentTurn}</p>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {gameState.territories.map((territory, index) => (
              <button
                key={index}
                className={`p-4 border ${
                  territory ? "bg-green-400" : "bg-gray-200"
                }`}
                onClick={() => takeTurn(index)}
              >
                {territory || "خالی"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

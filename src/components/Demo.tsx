"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import sdk, { Context, FrameNotificationDetails } from "@farcaster/frame-sdk";
import { Button } from "~/components/ui/Button";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import { Label } from "~/components/ui/label";

export default function Demo({ title }: { title?: string } = { title: "Farcaster Mancala Game" }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();
  const [players, setPlayers] = useState<string[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const [gameBoard, setGameBoard] = useState<number[]>(Array(24).fill(4)); // 24 خانه، هر کدام 4 مهره
  const [lastEvent, setLastEvent] = useState<string>("");

  const { address, isConnected } = useAccount();
  const { data: session } = useSession();

  const addPlayer = useCallback(() => {
    if (players.length < 4) { // برای بازی منچ 4 بازیکن می‌تواند بازی کند
      setPlayers((prev) => [...prev, session?.user?.name || "Player"]);
    }
  }, [players, session]);

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      setIsSDKLoaded(true);
      setCurrentTurn(players[0] || null);
    };

    if (!isSDKLoaded && sdk) {
      load();
    }
  }, [isSDKLoaded, players]);

  const rollDice = useCallback(() => {
    // شبیه‌سازی پرتاب تاس برای حرکت در بازی منچ
    return Math.floor(Math.random() * 6) + 1;
  }, []);

  const makeMove = useCallback((index: number) => {
    if (currentTurn !== session?.user?.name) {
      alert("It's not your turn!");
      return;
    }

    // شبیه‌سازی حرکت مهره‌ها با توجه به تاس
    const dice = rollDice();
    let newBoard = [...gameBoard];
    newBoard[index] -= dice; // مهره‌ها کم می‌شوند
    setGameBoard(newBoard);

    // تغییر نوبت به بازیکن بعدی
    const nextPlayerIndex = (players.indexOf(currentTurn) + 1) % players.length;
    setCurrentTurn(players[nextPlayerIndex]);
    setLastEvent(`Player ${currentTurn} moved piece from index ${index}`);
  }, [gameBoard, currentTurn, players, session?.user?.name, rollDice]);

  const resetGame = useCallback(() => {
    setGameBoard(Array(24).fill(4));
    setPlayers([]);
    setCurrentTurn(null);
    setLastEvent("Game reset.");
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[400px] mx-auto py-4">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      <div className="mb-4">
        <p>{players.length < 4 ? "Waiting for more players..." : `Players: ${players.join(", ")}`}</p>
        {players.length < 4 && (
          <Button onClick={addPlayer}>Add Player</Button>
        )}
      </div>
      <div className="mb-4">
        <h2 className="font-2xl font-bold">Game Board</h2>
        <div className="grid grid-cols-6 gap-2">
          {gameBoard.map((piles, index) => (
            <div
              key={index}
              className="p-4 border bg-gray-200 text-center"
              onClick={() => makeMove(index)}
            >
              <div>{piles} pieces</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p>Current Turn: {currentTurn}</p>
        <p>Last Event: {lastEvent || "None"}</p>
      </div>
      <div className="mb-4">
        <Button onClick={resetGame}>Reset Game</Button>
      </div>
    </div>
  );
}

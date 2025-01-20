"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/Button";

export default function Demo({
  title = "Frames v2 Demo",
}: {
  title?: string;
}) {
  const [checkingEarnings, setCheckingEarnings] = useState(false);
  const [earningsResult, setEarningsResult] = useState<string | null>(null);
  const [earningsError, setEarningsError] = useState<string | null>(null);

  const checkEarnings = useCallback(async () => {
    try {
      setCheckingEarnings(true);
      setEarningsError(null);
      setEarningsResult(null);

      // Simulate an API call or SDK action to check earnings.
      const earningsData = await fetch("/components/demo", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch earnings.");
        return res.json();
      });

      setEarningsResult(`You have earned ${earningsData.amount} so far.`);
    } catch (error: any) {
      setEarningsError(error.message || "An unexpected error occurred.");
    } finally {
      setCheckingEarnings(false);
    }
  }, []);

  return (
    <div
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        <div className="mb-4">
          <Button
            onClick={checkEarnings}
            disabled={checkingEarnings}
            isLoading={checkingEarnings}
          >
            Check Your Earnings
          </Button>
        </div>

        {earningsResult && (
          <div className="my-2 text-sm text-green-600">
            {earningsResult}
          </div>
        )}

        {earningsError && (
          <div className="my-2 text-sm text-red-600">
            Error: {earningsError}
          </div>
        )}
      </div>
    </div>
  );
}

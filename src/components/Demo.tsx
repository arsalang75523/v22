import { gql, GraphQLClient } from "graphql-request";
import { useEffect, useState } from "react";

// Define the type for the API response
type SubjectToken = {
  buySideVolume: string;
  currentPriceInMoxie: string;
  name: string;
  symbol: string;
};

type QueryResponse = {
  subjectTokens: SubjectToken[];
};

const graphQLClient = new GraphQLClient(
  "https://api.studio.thegraph.com/query/23537/moxie_protocol_stats_mainnet/version/latest"
);

const query = gql`
query MyQuery {
  subjectTokens(orderBy: buySideVolume, orderDirection: desc) {
    buySideVolume
    currentPriceInMoxie
    name
    symbol
  }
}
`;

function Demo() {
  const [coins, setCoins] = useState<SubjectToken[]>([]);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const data: QueryResponse = await graphQLClient.request(query);
        setCoins(data.subjectTokens.slice(0, 4)); // Limit to top 4 coins for frame buttons
      } catch (error) {
        console.error("Error fetching trending coins:", error);
      }
    };

    fetchTrendingCoins();
  }, []);

  if (coins.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <meta property="fc:frame" content="vNext" />
      <meta
        property="fc:frame:image"
        content="https://example.com/trending-coins-image.png"
      />
      {coins.map((coin, index) => (
        <meta
          key={index}
          property={`fc:frame:button:${index + 1}`}
          content={`${coin.name} (${coin.symbol}) - Volume: ${coin.buySideVolume}`}
        />
      ))}
    </div>
  );
}

export default Demo;

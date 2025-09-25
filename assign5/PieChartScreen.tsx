import React, { useEffect, useState } from "react";
import { View, Dimensions, Text } from "react-native";
import { getRealm } from "../db/realm";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function PieChartScreen() {
  const [data, setData] = useState<any[]>([]); // data for chart

  useEffect(() => {
    const realm = getRealm();
    const results = realm.objects("Expense");
    const recompute = () => {
      // aggregate by category
      const map = new Map<string, number>();
      for (const item of results) {
        const e = item as any; // Cast to any to resolve property access
        const cat = e.category || "Other";
        map.set(cat, (map.get(cat) || 0) + Number(e.amount));
      }
      const chartData = Array.from(map.entries()).map(([name, value], idx) => ({
        name,
        amount: value,
        color: getColor(idx),
        legendFontColor: "#7F7F7F",
        legendFontSize: 14,
      }));
      setData(chartData);
    };
    recompute();
    // @ts-ignore
    results.addListener(recompute);
    return () => {
      // @ts-ignore
      results.removeListener(recompute);
    };
  }, []);

  if (data.length === 0) return <Text style={{ padding: 16 }}>No expenses yet</Text>;

  return (
    <View>
      <PieChart
        data={data.map((d) => ({
          name: d.name,
          population: d.amount,
          color: d.color,
          legendFontColor: d.legendFontColor,
          legendFontSize: d.legendFontSize,
        }))}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}

function getColor(idx: number) {
  // palette (you can replace)
  const palette = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
  return palette[idx % palette.length];
}

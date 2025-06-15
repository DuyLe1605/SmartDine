"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const colors = [
    "var(--color-Color1)",
    "var(--color-Color2)",
    "var(--color-Color3)",
    "var(--color-Color4)",
    "var(--color-Color5)",
];

const chartConfig = {
    Color1: {
        label: " Color2",
        color: "var(--chart-1)",
    },
    Color2: {
        label: "Color2",
        color: "var(--chart-2)",
    },
    Color3: {
        label: "Color3",
        color: "var(--chart-3)",
    },
    Color4: {
        label: "Color4",
        color: "var(--chart-4)",
    },
    Color5: {
        label: "Color5",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;
const chartData = [
    { name: "chrome", successOrders: 275, fill: "var(--color-top1)" },
    { name: "safari", successOrders: 200, fill: "var(--color-safari)" },
    { name: "firefox", successOrders: 187, fill: "var(--color-firefox)" },
    { name: "edge", successOrders: 173, fill: "var(--color-edge)" },
    { name: "other", successOrders: 90, fill: "var(--color-other)" },
];

export function DishBarChart({
    chartData,
}: {
    chartData: {
        successOrders: number;
        name: string;
    }[];
}) {
    const chartDataFilled = chartData.map((data, index) => {
        const calcIndex = index % 5;
        return { ...data, fill: colors[calcIndex] };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Xếp hạng món ăn</CardTitle>
                <CardDescription>Được gọi nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartDataFilled}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={2}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return value;

                                // return chartConfig[value as keyof typeof chartConfig]?.label
                            }}
                        />
                        <XAxis dataKey="successOrders" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="successOrders" name={"Đơn thanh toán"} layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className='flex gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div> */}
                {/* <div className='leading-none text-muted-foreground'>
          Showing total visitors for the last 6 months
        </div> */}
            </CardFooter>
        </Card>
    );
}

"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Fuse from "fuse.js";
import { Terminal, Info } from "lucide-react";
import { useMemo, useState } from "react";
interface DataType {
  title: string;
  description: {
    short: string;
    long: string;
  };
  url: string;
  tags: string[];
  updated: string;
}
const data: DataType[] = require("../../data.json");
const newCalcTime = 24 * 60 * 60 * 1000;
const fuse = new Fuse(data, {
  keys: ["title", "description.short"],
  threshold: 0.3,
  distance: 100
});
function createLink(displayText: string, link: string) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold hover:border-b-2 border-black"
    >
      {displayText}
    </a>
  );
}

function getTime() {
  const UTCTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const ESTOffset = -5 * 60;
  return UTCTime + ESTOffset * 60000;
}

export default function Page() {
  const [age, setAge] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const month = new Date(getTime()).getMonth() + 1,
    day = new Date(getTime()).getDate();
  const sortedData = useMemo(() => {
    let sortData: DataType[] = [];
    sortData =
      search != "" ? fuse.search(search).map((result) => result.item) : data;
    if (age === "18+") {
      sortData = sortData.filter((item) => !item.tags.includes("18-"));
    }
    if (price !== "") {
      sortData = sortData.filter((item) =>
        price === "free"
          ? item.tags.includes("free")
          : item.tags.includes("paid")
      );
    }
    return sortData.sort(
      (a, b) => parseInt(b.updated, 10) - parseInt(a.updated, 10)
    );
  }, [age, price, search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  return (
    <main>
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold">I wish I knew</div>
        <p className="text-sm">
          (a collection of resources gathered and simplified)
        </p>
      </div>
      <div className="px-6 md:px-16">
        {month === 12 && day > 0 && day <= 25 && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Advent of Code</AlertTitle>
            <AlertDescription>
              Day <span className="font-bold">{day}</span> of the Advent of Code
              is live! Check it out here:{" "}
              {createLink(
                "https://adventofcode.com/",
                "https://adventofcode.com"
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="px-6 mt-6">
        <div className="text-lg font-bold">I know I want</div>
        <div className="flex space-x-2">
          <Input
            className="w-[80px] md:w-[300px]"
            type="text"
            placeholder="everything..."
            onChange={handleSearch}
          />
          <Select onValueChange={setAge} value={age}>
            <SelectTrigger className="w-[80px] md:w-[120px]">
              <SelectValue placeholder="Age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="18-">18-</SelectItem>
              <SelectItem value="18+">18+</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setPrice} value={price}>
            <SelectTrigger className="w-[80px] md:w-[120px]">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <button
            disabled={age == "" && price == ""}
            onClick={() => {
              setAge("");
              setPrice("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <ol className="p-6">
        {sortedData.length == 0 && (
          <>
            <li>
              no resource match your filters <b>yet</b>, new resources are being
              added
            </li>
            <li>
              can&apos;t wait? tweet{" "}
              <code>
                {createLink(
                  `#iwishiknewmore`,
                  `https://twitter.com/intent/post?text=add%20more%20resources%20to%20${
                    age == "18+" ? "18%2B" : age
                  }%20and%20${price}%20%0A%23iwishiknewmore`
                )}
              </code>
            </li>
          </>
        )}
        {price == "paid" && (
          <span className="text-sm text-gray-800 flex space-x-1">
            <Info className="h-4 w-4" />
            <i>
              resources with both free and paid tags, may have something behind
              a paywall
            </i>
          </span>
        )}
        {sortedData.map((item) => (
          <li className="mb-4" key={item.title}>
            <div className="space-x-3">
              {createLink(item.title, item.url)}
              {Date.now() - parseInt(item.updated, 10) < newCalcTime && (
                <span className="text-xs font-light bg-red-600 text-white p-1 rounded-full">
                  NEW
                </span>
              )}
            </div>
            <p>{item.description.short}</p>
            <div className="flex flex-wrap mt-2 text-gray-800 text-sm">
              {item.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded mr-2">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}

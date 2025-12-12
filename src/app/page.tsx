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
import { Button } from "@/components/ui/button";
import Fuse from "fuse.js";
import { Terminal, Info, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
interface DataType {
  title: string;
  description: string;
  url: string;
  tags: string[];
  updated: string;
}
const data: DataType[] = require("@/data/web.json");
const newCalcTime = 24 * 60 * 60 * 1000;
const fuse = new Fuse(data, {
  keys: [
    { name: "title", weight: 0.7 },
    {
      name: "description",
      weight: 0.3,
    },
  ],
});

function createLink(displayText: string, link: string) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-semibold text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-foreground after:transition-all hover:after:w-full group"
    >
      {displayText}
      <ArrowUpRight className="hidden group-hover:block w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
    let sortData: DataType[] = data;
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
    if (search !== "") {
      const searchResults = fuse.search(search);
      const searchTitles = new Set(searchResults.map((r) => r.item.title));
      sortData = sortData.filter((item) => searchTitles.has(item.title));
    }
    return sortData.sort(
      (a, b) => parseInt(b.updated, 10) - parseInt(a.updated, 10)
    );
  }, [age, price, search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">
            I wish I knew
          </h1>
          <p className="text-sm text-muted-foreground">
            curated resources, simplified
          </p>
        </header>

        {month === 12 && day > 0 && day <= 12 && (
          <Alert className="mb-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>
              Advent of Code{" "}
              <strong className="text-red-700">
                ({12 - day} day{12 - day !== 1 ? "s" : ""} left)
              </strong>
            </AlertTitle>
            <AlertDescription>
              <p>
                this year's advent of code challenge is only <strong>12</strong>{" "}
                days
              </p>
              <p>
                {createLink(
                  `attempt day ${day} puzzle`,
                  `https://adventofcode.com/2025/day/${day}`
                )}
              </p>
            </AlertDescription>
          </Alert>
        )}

        <section className="mb-8 space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="default"
              disabled={search === "" && age === "" && price === ""}
              onClick={() => {
                setSearch("");
                setAge("");
                setPrice("");
              }}
            >
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Select onValueChange={setAge} value={age}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-">18-</SelectItem>
                <SelectItem value="18+">18+</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setPrice} value={price}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {price === "paid" && sortedData.length > 0 && (
          <Alert className="mb-8">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Resources with both tags may include paywalled content
            </AlertDescription>
          </Alert>
        )}

        {sortedData.length === 0 && (
          <div className="text-muted-foreground">
            <p>No resources match your filters yet.</p>
            <p className="text-sm">
              Want to add one?{" "}
              {createLink(
                "Submit a PR",
                "https://github.com/itwilsonlu/iwishiknew/pulls"
              )}
            </p>
          </div>
        )}

        <div className="space-y-8">
          {sortedData.map((item) => {
            const isNew = Date.now() - parseInt(item.updated, 10) < newCalcTime;
            return (
              <article key={item.title} className="group relative">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isNew ? "bg-orange-500" : "bg-foreground"
                    } mt-2 opacity-40 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-medium">
                        {createLink(item.title, item.url)}
                      </h2>
                      {isNew && (
                        <span className="text-xs font-semibold bg-orange-500 text-white px-2.5 py-1 rounded-full">
                          new
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 border rounded-sm text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}

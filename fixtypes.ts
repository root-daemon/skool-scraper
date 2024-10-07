import * as fs from "fs";

interface Community {
  title: string;
  description: string;
  meta: string;
  link: string;
  category: string;
}

interface ProcessedCommunity {
  title: string;
  description: string;
  visibility: string;
  membersCount: number;
  type: "Paid" | "Free" | { price: string };
  link: string;
  category: string;
}

function processMembers(metaStr: string): {
  visibility: string;
  membersCount: number;
  type: "Paid" | "Free" | { price: string };
} {
  // Split the meta string into its components (visibility, members, type)
  const parts = metaStr.split("•").map((part) => part.trim());

  // Check if parts are correctly structured
  if (parts.length < 3) {
    throw new Error("Invalid meta format");
  }

  const visibility = parts[0]; // Visibility like 'Private' or 'Public'
  const membersCountRaw = parts[1].split(" ")[0]; // Extract the number part from "41.6k Members"
  
  let membersCount: number;

  // Handle different formats like '41.6k' or '1.1M'
  if (membersCountRaw.includes("k")) {
    membersCount = parseFloat(membersCountRaw.replace("k", "")) * 1000;
  } else if (membersCountRaw.includes("M")) {
    membersCount = parseFloat(membersCountRaw.replace("M", "")) * 1000000;
  } else {
    membersCount = parseInt(membersCountRaw.replace(/[^0-9]/g, ""), 10);
  }

  // Determine type (Paid, Free, or custom price)
  let type: "Paid" | "Free" | { price: string };
  const typeStr = parts[2].toLowerCase();

  if (typeStr === "free") {
    type = "Free";
  } else if (typeStr === "paid") {
    type = "Paid";
  } else {
    type = { price: parts[2] }; // Handle cases with custom pricing like "$49/month"
  }

  return { visibility, membersCount, type };
}

// Load and process the data from the JSON file
function loadData(filePath: string): ProcessedCommunity[] {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Community[];

  return data.map((community) => {
    const { visibility, membersCount, type } = processMembers(community.meta);
    return {
      title: community.title,
      description: community.description,
      visibility,
      membersCount,
      type,
      link: community.link,
      category: community.category,
    };
  });
}``

function saveData(filePath: string, data: ProcessedCommunity[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

const inputFilePath = "./groups.json";
const outputFilePath = "./processed_groups.json";
try {
  const processedData = loadData(inputFilePath);

  saveData(outputFilePath, processedData);

  console.log(`Processed data saved to ${outputFilePath}`);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error processing data:", error.message);
  } else {
    console.error("Error processing data:", error);
  }
}

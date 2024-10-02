import * as fs from "fs";

interface Community {
  title: string;
  description: string;
  members: string;
  link: string;
}

interface ProcessedCommunity {
  title: string;
  description: string;
  visibility: string;
  membersCount: number;
  type: "Paid" | "Free" | { price: string };
  link: string;
}

function processMembers(membersStr: string): {
  visibility: string;
  membersCount: number;
  type: "Paid" | "Free" | { price: string };
} {
  // Split the members string into its components
  const parts = membersStr.split("•").map((part) => part.trim());

  // Parse visibility, members count, and type
  const visibility = parts[0];

  // Extract the members count
  const membersCountRaw = parts[1].split(" ")[0]; // Get the number part before "Members"
  let membersCount: number;

  // Handle cases like "41.2k", "150.9k", and "1.1M"
  if (membersCountRaw.includes("k")) {
    membersCount = parseFloat(membersCountRaw.replace("k", "")) * 1000;
  } else if (membersCountRaw.includes("M")) {
    membersCount = parseFloat(membersCountRaw.replace("M", "")) * 1000000;
  } else {
    membersCount = parseInt(membersCountRaw.replace(/[^0-9]/g, ""), 10); // Just in case it's a plain number
  }

  // Handle type (paid/free or custom price)
  let type: "Paid" | "Free" | { price: string };
  if (parts[2].toLowerCase() === "free") {
    type = "Free";
  } else if (parts[2].toLowerCase() === "paid") {
    type = "Paid";
  } else {
    type = { price: parts[2] };
  }

  return { visibility, membersCount, type };
}

// Load and process the data from the JSON file
function loadData(filePath: string): ProcessedCommunity[] {
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Community[];

  return data.map((community) => {
    const { visibility, membersCount, type } = processMembers(community.members);
    return {
      title: community.title,
      description: community.description,
      visibility,
      membersCount,
      type,
      link: community.link,
    };
  });
}

// Save the processed data to a new JSON file
function saveData(filePath: string, data: ProcessedCommunity[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Example usage
const inputFilePath = "./groups.json";
const outputFilePath = "./processed_groups.json";
const processedData = loadData(inputFilePath);

// Save the processed data to a new file
saveData(outputFilePath, processedData);

console.log(`Processed data saved to ${outputFilePath}`);

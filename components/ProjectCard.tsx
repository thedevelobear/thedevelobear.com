import Link from "next/link";
import { getRewardsStats, humanOMatic, rewards } from "@/lib/projects";
import { RewardDemo } from "./RewardDemo";

type CardProps = {
  headingLevel: "h2" | "h3";
  /** The /projects/ page shows everything. The home page is shorter. */
  detailed?: boolean;
};

const title = "display text-[clamp(3.75rem,7vw,6.5rem)] leading-[0.86]";
const band = "scroll-mt-4 py-14 sm:py-20";
const columns =
  "shell grid items-center gap-x-16 gap-y-12 lg:grid-cols-2 [&>*]:min-w-0";

function Features({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 border-current/30 border-t-3 font-semibold">
      {items.map((item) => (
        <li key={item} className="border-current/30 border-b-3 py-2.5">
          {item}
        </li>
      ))}
    </ul>
  );
}

const count = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumSignificantDigits: 3,
});

async function RewardsStats() {
  const { stars, weeklyDownloads } = await getRewardsStats();
  const stats = [
    stars !== null && [count.format(stars), "GitHub stars"],
    weeklyDownloads !== null && [
      compact.format(weeklyDownloads),
      "npm downloads a week",
    ],
  ].filter((stat) => Array.isArray(stat));
  if (stats.length === 0) return null;

  return (
    <ul className="display mt-7 flex flex-col gap-2 text-[1.75rem] sm:text-[2rem]">
      {stats.map(([value, label]) => (
        <li key={label} className="flex items-baseline gap-3">
          <span className="text-[1.5em] text-honey leading-none">{value}</span>{" "}
          {label}
        </li>
      ))}
    </ul>
  );
}

export function RewardsCard({ headingLevel: Heading, detailed }: CardProps) {
  const { links } = rewards;
  return (
    <article
      id="react-rewards"
      className={`${band} on-ink bg-graphite text-sheet`}
    >
      <div className={columns}>
        <div>
          <Heading className={title}>{rewards.name}</Heading>
          <p className="mt-5 max-w-lg font-semibold text-xl">{rewards.pitch}</p>
          <RewardsStats />
          <Features items={rewards.features} />
          {detailed && (
            <p className="on-ink mt-7 overflow-x-auto bg-ink px-4 py-3 text-sheet text-sm">
              <code>{rewards.install}</code>
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a href={links.docs} className="button bg-sheet text-ink">
              Read the docs
            </a>
            <a href={links.github} className="big-link">
              GitHub
            </a>
            <a href={links.npm} className="big-link">
              npm
            </a>
          </div>
          <p className="mt-5">
            <Link href={links.post} className="text-link">
              Why I care about microinteractions
            </Link>
          </p>
        </div>
        <div>
          <RewardDemo />
        </div>
      </div>
    </article>
  );
}

export function HumanOMaticCard({
  headingLevel: Heading,
  detailed,
}: CardProps) {
  // The home page shows the last exchange of the same conversation.
  const lines = detailed
    ? humanOMatic.dialogue
    : humanOMatic.dialogue.slice(-3);
  return (
    <article className={`${band} bg-apricot`}>
      <div className={columns}>
        <div className="lg:order-last">
          <Heading className={title}>{humanOMatic.name}</Heading>
          <p className="mt-5 max-w-lg font-semibold text-xl">
            {humanOMatic.pitch}
          </p>
          <Features items={humanOMatic.features} />
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a href={humanOMatic.links.web} className="button">
              Open the web version
            </a>
            <a href={humanOMatic.links.github} className="big-link">
              GitHub
            </a>
          </div>
        </div>
        {/* The conversation, as two voices answering each other. */}
        <figure className="mx-auto w-full max-w-md">
          <ol className="flex flex-col gap-4">
            {lines.map(([speaker, text]) => (
              <li
                key={text}
                className={`px-6 py-4 ${speaker === "You" ? "ml-12 self-end bg-sheet text-right" : "on-ink mr-8 self-start bg-ink text-sheet"}`}
              >
                <span
                  className={`display block text-3xl ${speaker === "You" ? "" : "text-honey"}`}
                >
                  {speaker}
                </span>
                <span className="mt-1 block text-[0.9375rem]">{text}</span>
              </li>
            ))}
          </ol>
          <figcaption className="mt-5 text-center font-semibold text-sm">
            An example from the README. The words and numbers depend on the
            song.
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

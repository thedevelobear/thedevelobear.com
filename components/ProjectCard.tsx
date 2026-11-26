import Link from "next/link";
import { getRewardsStats, humanOMatic, rewards } from "@/lib/projects";
import { RewardDemo } from "./RewardDemo";

type CardProps = {
  headingLevel: "h2" | "h3";
  /** The /projects/ page shows everything. The home page shows short cards. */
  detailed?: boolean;
};

const bandTitle = "display text-[clamp(3.75rem,7vw,6.5rem)] leading-[0.86]";
const cardTitle = "display text-[clamp(3rem,5vw,4.25rem)] leading-[0.88]";
const band = "scroll-mt-4";
const columns =
  "shell grid items-center gap-x-16 gap-y-12 lg:grid-cols-2 [&>*]:min-w-0";
const card = "tilt flex h-full scroll-mt-4 flex-col bg-sheet p-7 sm:p-10";
const pitch = "mt-5 max-w-lg font-semibold text-xl";

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
          <span className="text-[1.5em] leading-none">{value}</span> {label}
        </li>
      ))}
    </ul>
  );
}

function RewardsLinks() {
  const { links } = rewards;
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <a href={links.docs} className="big-link">
        Read the docs
      </a>
      <a href={links.github} className="big-link">
        GitHub
      </a>
      <a href={links.npm} className="big-link">
        npm
      </a>
    </div>
  );
}

export function RewardsCard({ headingLevel: Heading, detailed }: CardProps) {
  if (!detailed) {
    return (
      <article id="react-rewards" className={`${card} [--tilt:-0.6deg]`}>
        <Heading className={cardTitle}>{rewards.name}</Heading>
        <p className={pitch}>{rewards.pitch}</p>
        <RewardsStats />
        <div className="mt-auto pt-10">
          <RewardDemo className="items-start" />
          <div className="mt-4">
            <RewardsLinks />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article id="react-rewards" className={`${band} bg-rose py-16 sm:py-24`}>
      <div className={columns}>
        <div>
          <Heading className={bandTitle}>{rewards.name}</Heading>
          <p className={pitch}>{rewards.pitch}</p>
          <RewardsStats />
          <Features items={rewards.features} />
          <p className="on-ink mt-7 overflow-x-auto bg-ink px-4 py-3 text-sheet text-sm">
            <code>{rewards.install}</code>
          </p>
          <div className="mt-8">
            <RewardsLinks />
          </div>
          <p className="mt-5">
            <Link href={rewards.links.post} className="text-link">
              Why I care about microinteractions
            </Link>
          </p>
        </div>
        <RewardDemo className="items-center text-center" />
      </div>
    </article>
  );
}

/** The conversation, as two voices answering each other. */
function Dialogue({
  lines,
}: {
  lines: readonly (readonly [string, string])[];
}) {
  return (
    <ol className="flex flex-col gap-4">
      {lines.map(([speaker, text]) => (
        <li
          key={text}
          className={`px-6 py-4 ${speaker === "You" ? "ml-12 self-end bg-smudge text-right" : "on-ink mr-8 self-start bg-ink text-sheet"}`}
        >
          <span
            className={`display block text-3xl ${speaker === "You" ? "" : "text-pink"}`}
          >
            {speaker}
          </span>
          <span className="mt-1 block text-[0.9375rem]">{text}</span>
        </li>
      ))}
    </ol>
  );
}

function HumanOMaticLinks() {
  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <a href={humanOMatic.links.web} className="button">
        Open the web version
      </a>
      <a href={humanOMatic.links.github} className="big-link">
        GitHub
      </a>
    </div>
  );
}

export function HumanOMaticCard({
  headingLevel: Heading,
  detailed,
}: CardProps) {
  if (!detailed) {
    return (
      <article className={`${card} [--tilt:0.6deg]`}>
        <Heading className={cardTitle}>{humanOMatic.name}</Heading>
        <p className={pitch}>{humanOMatic.pitch}</p>
        {/* One short question and answer from the README example. */}
        <div className="mt-8">
          <Dialogue lines={humanOMatic.dialogue.slice(3, 5)} />
        </div>
        <div className="mt-auto pt-10">
          <HumanOMaticLinks />
        </div>
      </article>
    );
  }

  return (
    // The last band on its page: it leaves room for the footer's bear.
    <article className={`${band} bear-room bg-mauve pt-16 sm:pt-24`}>
      <div className={columns}>
        <div className="lg:order-last">
          <Heading className={bandTitle}>{humanOMatic.name}</Heading>
          <p className={pitch}>{humanOMatic.pitch}</p>
          <Features items={humanOMatic.features} />
          <div className="mt-8">
            <HumanOMaticLinks />
          </div>
        </div>
        <figure className="mx-auto w-full max-w-md">
          <Dialogue lines={humanOMatic.dialogue} />
          <figcaption className="mt-5 text-center font-semibold text-sm">
            An example from the README. The words and numbers depend on the
            song.
          </figcaption>
        </figure>
      </div>
    </article>
  );
}

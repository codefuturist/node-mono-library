import { capitalize, toKebabCase } from "@repo/utils/string";
import { chunk, unique } from "@repo/utils/array";
import { pick, deepMerge } from "@repo/utils/object";
import styles from "./page.module.css";

export default function Home() {
  // Demo: String utilities
  const greeting = capitalize("hello from utils!");
  const kebabExample = toKebabCase("helloWorld");

  // Demo: Array utilities
  const numbers = [1, 2, 2, 3, 3, 3, 4, 5];
  const uniqueNumbers = unique(numbers);
  const chunkedNumbers = chunk(uniqueNumbers, 2);

  // Demo: Object utilities
  const user = { name: "John", age: 30, email: "john@example.com" };
  const publicUser = pick(user, ["name", "age"]);
  const merged = deepMerge(
    { theme: "dark", settings: { notifications: true } },
    { settings: { sound: false } }
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>@repo/utils Demo</h1>

        <section>
          <h2>String Utilities</h2>
          <p>
            <code>capitalize(&quot;hello from utils!&quot;)</code> →{" "}
            <strong>{greeting}</strong>
          </p>
          <p>
            <code>toKebabCase(&quot;helloWorld&quot;)</code> →{" "}
            <strong>{kebabExample}</strong>
          </p>
        </section>

        <section>
          <h2>Array Utilities</h2>
          <p>
            <code>unique([1, 2, 2, 3, 3, 3, 4, 5])</code> →{" "}
            <strong>[{uniqueNumbers.join(", ")}]</strong>
          </p>
          <p>
            <code>chunk([1, 2, 3, 4, 5], 2)</code> →{" "}
            <strong>{JSON.stringify(chunkedNumbers)}</strong>
          </p>
        </section>

        <section>
          <h2>Object Utilities</h2>
          <p>
            <code>pick(user, [&quot;name&quot;, &quot;age&quot;])</code> →{" "}
            <strong>{JSON.stringify(publicUser)}</strong>
          </p>
          <p>
            <code>deepMerge(obj1, obj2)</code> →{" "}
            <strong>{JSON.stringify(merged)}</strong>
          </p>
        </section>
      </main>
    </div>
  );
}

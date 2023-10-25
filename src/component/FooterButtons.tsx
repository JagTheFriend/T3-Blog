import type { PropsWithChildren } from "react";

function FooterButtons(props: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      {props.children}
    </div>
  );
}

export default FooterButtons;

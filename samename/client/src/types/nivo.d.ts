// client/src/types/nivo.d.ts

declare module "@nivo/pie" {
  import { FC } from "react";

  type NivoPieProps = Record<string, unknown>;

  export const ResponsivePie: FC<NivoPieProps>;
  const Pie: FC<NivoPieProps>;
  export default Pie;
}

declare module "@nivo/bar" {
  import { FC } from "react";

  type NivoBarProps = Record<string, unknown>;

  export const ResponsiveBar: FC<NivoBarProps>;
  const Bar: FC<NivoBarProps>;
  export default Bar;
}

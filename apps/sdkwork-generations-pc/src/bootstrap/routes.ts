export interface GenerationsPcRoute {
  id: string;
  path: string;
  packageName: string;
  surface: "app";
  title: string;
}

export const generationsPcRoutes = {
  workspace: {
    id: "generations.workspace",
    packageName: "@sdkwork/generations-pc-workspace",
    path: "/generations",
    surface: "app",
    title: "Generations",
  },
} as const satisfies Record<string, GenerationsPcRoute>;

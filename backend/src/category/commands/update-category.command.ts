export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly data: { name?: string; color?: string; icon?: string },
  ) {}
}

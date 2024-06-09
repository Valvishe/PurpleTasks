import * as vscode from "vscode";
import { TreeItem, TreeDataProvider, Event, EventEmitter } from "vscode";

export class CourseTreeDataProvider
  implements TreeDataProvider<CourseTreeItem>
{
  private _onDidChangeTreeData: EventEmitter<CourseTreeItem | undefined> =
    new EventEmitter<CourseTreeItem | undefined>();
  readonly onDidChangeTreeData: Event<CourseTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  private token: string;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.token = context.globalState.get("accessToken") as string;
    this.context = context;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: CourseTreeItem): TreeItem {
    return element;
  }

  async getChildren(element?: CourseTreeItem): Promise<CourseTreeItem[]> {
    if (!element) {
      const res = await fetch(
        "https://app.purpleschool.ru/api-v2/course/my?studentCourse=my",
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          method: "GET",
        }
      );

      const data = await res.json();

      console.log(data);
      return (data as CourseTreeItem[]).map(
        (course) =>
          new CourseTreeItem(course.title, vscode.TreeItemCollapsibleState.None)
      );
    }
    return [];
  }
}

class CourseTreeItem extends vscode.TreeItem {
  constructor(
    public readonly title: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(title, collapsibleState);
  }
}

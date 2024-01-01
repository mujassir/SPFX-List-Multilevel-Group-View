import * as React from 'react';
import styles from './ListMultilevelGroupView.module.scss';
import type { IListMultilevelGroupViewProps } from './IListMultilevelGroupViewProps';
import { ListView, SelectionMode, GroupOrder } from "@pnp/spfx-controls-react/lib/ListView";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { Oval } from 'react-loader-spinner' //https://www.npmjs.com/package/react-loader-spinner
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";

export default class ListMultilevelGroupView extends React.Component<IListMultilevelGroupViewProps, {}> {
  private _sp: SPFI;

  public state = {
    isLoading: true,
    hasErrors: false,
    errors: null,
    items: [],
    viewFields: [],
    groupByFields: []
  };

  private _getSelection(items: any[]) {
    console.log('Selected items:', items);
  }


  public componentDidMount(): void {
    this._sp = spfi().using(SPFx(this.props.context));

    this.getListData();
  }

  private async getListData() {

    let listTitle = '';
    if (this.props.lists) listTitle = this.props.lists.title;
    if (!listTitle || listTitle.length == 0) return;

    const allFields = await this._sp.web.lists.getByTitle(listTitle).fields();
    const titleToInternalNameMap = new Map();

    allFields.forEach((field: { Title: any; InternalName: any; }) => {
      titleToInternalNameMap.set(field.Title, field.InternalName);
    });

    let internalNamesArray = this.props.listColumns.map(title => {
      return titleToInternalNameMap.get(title) || title; // Fallback to title if mapping not found
    });
    let viewFields: { name: any; displayName: any; isResizable: boolean; sorting: boolean; }[] = [];
    if (this.props.orderedListColumns) {
      //const count = this.props.orderedListColumns.length;
      viewFields = this.props.orderedListColumns.map(title => {
        return {
          name: titleToInternalNameMap.get(title) || title,
          displayName: title,
          isResizable: true,
          sorting: true,
          minWidth: 100,
          maxWidth: 100
        }
      });
    }
    let groupByFields: { name: any; order: GroupOrder; }[] = [];
    if (this.props.groupByFields) {
      groupByFields = this.props.groupByFields.map(d => {
        return {
          name: titleToInternalNameMap.get(d.column) || d.column,
          order: d.sortOrder == "descending" ? GroupOrder.descending : GroupOrder.ascending
        }
      });
    }
    this.setState({ viewFields: viewFields });
    this.setState({ groupByFields: groupByFields });


    const items = await this._sp.web.lists.getByTitle(listTitle).items
      .select(...internalNamesArray).top(2000)();
    this.setState({ isLoading: false });

    this.setState({ items: items });
  }

  public render(): React.ReactElement<IListMultilevelGroupViewProps> {

    let listTitle = '';
    if (this.props.lists) listTitle = this.props.lists.title;
    return listTitle && listTitle.length > 0 ? this.renderUI() : this.renderPlaceHolder();
  }

  public renderUI(): React.ReactElement<IListMultilevelGroupViewProps> {
    return (
      <div className={styles.welcome}>
        {this.state.isLoading ? this.renderLoader() : this.renderListView()}
      </div>
    );
  }

  public renderListView(): React.ReactElement<IListMultilevelGroupViewProps> {
    const className = `list-level-${this.state.groupByFields.length + 1}`
    return (
      <ListView
        items={this.state.items}
        viewFields={this.state.viewFields}
        iconFieldName="FileRef"
        compact={true}
        showFilter={this.props.showFilter}
        selectionMode={SelectionMode.none}
        selection={this._getSelection}
        groupByFields={this.state.groupByFields}
        stickyHeader={true}
        className={className}
      />
    );
  }


  private renderLoader() {
    return (
      <Oval
        visible={true}
        height="50"
        width="50"
        secondaryColor="#4dabf5"
        color="#0078D3"
        ariaLabel="oval-loading"
        wrapperStyle={{ display: 'block' }}
      />
    );
  }

  private renderPlaceHolder(): React.ReactElement<IListMultilevelGroupViewProps> {
    return (
      <Placeholder iconName='Edit'
        iconText='Configure your web part'
        description='Please configure the web part.'
        buttonLabel='Configure'
        onConfigure={this._onConfigure} />
    );
  }

  private _onConfigure = () => {
    // Context of the web part
    this.props.context.propertyPane.open();
  }
}

import * as React from 'react';
import styles from './ListMultilevelGroupView.module.scss';
import type { IListMultilevelGroupViewProps } from './IListMultilevelGroupViewProps';
import { ListView, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

const fieldNames = {

  name: 'field_1',
  country: 'field_2',
  region: 'field_3',
  website: 'field_4',
  category: 'field_6'

};
export default class ListMultilevelGroupView extends React.Component<IListMultilevelGroupViewProps, {}> {
  private _sp: SPFI;

  public state = {
    isLoading: false,
    hasErrors: false,
    errors: null,
    items: [],
  };

  private _getSelection(items: any[]) {
    console.log('Selected items:', items);
  }

  private _getDropFiles = (files: string | any[]) => {
    for (var i = 0; i < files.length; i++) {
      console.log(files[i].name);
    }
  }

  public componentDidMount(): void {
    this._sp = spfi().using(SPFx(this.props.context));

    this.getListData();
  }

  private async getListData(){

    const listName = 'Companies';
    // const columns = ["Title", "Region", "Country"];

    const items = await this._sp.web.lists.getByTitle(listName).items.select("ID", fieldNames.name, fieldNames.country, fieldNames.region, fieldNames.category, fieldNames.website).top(2000)();
    this.setState({items: items});
    console.log(this.state.items);
  }

  public render(): React.ReactElement<IListMultilevelGroupViewProps> {


    const groupByFields: IGrouping[] = [
       {
        name: fieldNames.country,
        order: GroupOrder.descending
      }, {
        name: fieldNames.region,
        order: GroupOrder.ascending
      },{
        name: fieldNames.category,
        order: GroupOrder.descending
      }
    ];

    const items = this.state.items;
    const viewFields = this.getViewFields();
    return (
      <div className={styles.welcome}>
        <ListView
          items={items}
          viewFields={viewFields}
          iconFieldName="FileRef"
          compact={true}
          selectionMode={SelectionMode.multiple}
          selection={this._getSelection}
          groupByFields={groupByFields}
          dragDropFiles={true}
          onDrop={this._getDropFiles}
          stickyHeader={true}
        />
      </div>
    );
  }

  private getViewFields(): any[] {
    const viewFields = [
      {
        name: 'ID',
        displayName: 'ID',
        minWidth: 50,
        maxWidth: 100,
      },
      {
        name: fieldNames.name,
        displayName: 'Name',
        minWidth: 150,
        maxWidth: 200,
      },
      {
        name: fieldNames.country,
        displayName: 'Country',
        minWidth: 150,
        maxWidth: 200,
      },
      {
        name: fieldNames.region,
        displayName: 'Region',
        minWidth: 200,
        maxWidth: 200,
      },
      {
        name: fieldNames.category,
        displayName: 'Category',
        minWidth: 200,
        maxWidth: 200,
      },
    ];

    return viewFields;

  }

  
}

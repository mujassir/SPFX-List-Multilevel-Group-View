import * as React from 'react';
import styles from './ListMultilevelGroupView.module.scss';
import type { IListMultilevelGroupViewProps } from './IListMultilevelGroupViewProps';
import { ListView, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

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

    // const columns = ["Title", "Region", "Country"];
    const items = await this._sp.web.lists.getByTitle("Test Companies").items.select("ID", "Title", "Region", "Country", "Category")();
    this.setState({items: items});
    console.log(this.state.items);
  }

  public render(): React.ReactElement<IListMultilevelGroupViewProps> {


    const groupByFields: IGrouping[] = [
       {
        name: "Country",
        order: GroupOrder.descending
      }, {
        name: "Region",
        order: GroupOrder.ascending
      },{
        name: "Category",
        order: GroupOrder.descending
      }
    ];

     const items2 = this.getCompanies();
     if(items2.length > 0){

     }
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
        minWidth: 100,
        maxWidth: 200,
      },
      {
        name: 'Title',
        displayName: 'Title',
        minWidth: 300,
        maxWidth: 200,
      },
      {
        name: 'Country',
        displayName: 'Country',
        minWidth: 200,
        maxWidth: 200,
      },
      {
        name: 'Region',
        displayName: 'Region',
        minWidth: 200,
        maxWidth: 200,
      },
      {
        name: 'Category',
        displayName: 'Category',
        minWidth: 200,
        maxWidth: 200,
      },
    ];

    return viewFields;

  }

  private getCompanies(): any[] {

    const companies = [
      {
        name: 'Redwood Studios',
        Category: 'Studio',
        Country: 'United States',
        Region: 'North America'
      },
      {
        name: 'Global Films Distribution',
        Category: 'Distributor',
        Country: 'United Kingdom',
        Region: 'Europe'
      },
      {
        name: 'CineVista Post',
        Category: 'Post Production',
        Country: 'France',
        Region: 'Europe'
      },
      {
        name: 'Oceanic Sales Agency',
        Category: 'Sales Agent',
        Country: 'Australia',
        Region: 'Oceania'
      },
      {
        name: 'Skyline Entertainment',
        Category: 'Studio',
        Country: 'Canada',
        Region: 'North America'
      },
      {
        name: 'Eastern Media Works',
        Category: 'Post Production',
        Country: 'India',
        Region: 'Asia'
      },
      {
        name: 'Nordic Distribution Co.',
        Category: 'Distributor',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Sunrise Studios',
        Category: 'Studio',
        Country: 'Japan',
        Region: 'Asia'
      },
      {
        name: 'Andean Creative Hub',
        Category: 'Post Production',
        Country: 'Argentina',
        Region: 'South America'
      },
      {
        name: 'African Film Partners',
        Category: 'Sales Agent',
        Country: 'South Africa',
        Region: 'Africa'
      },
      {
        name: 'Global Films Distribution',
        Category: 'Distributor',
        Country: 'United Kingdom',
        Region: 'Europe'
      },
      {
        name: 'Parisian Media Group',
        Category: 'Studio',
        Country: 'France',
        Region: 'Europe'
      },
      {
        name: 'Viking Entertainment',
        Category: 'Sales Agent',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Alpine Productions',
        Category: 'Post Production',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Baltic Film Services',
        Category: 'Distributor',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Iberian Cinematography',
        Category: 'Studio',
        Country: 'United Kingdom',
        Region: 'Europe'
      },
      {
        name: 'Athens Visual Arts',
        Category: 'Post Production',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Roman Media Works',
        Category: 'Sales Agent',
        Country: 'Ireland',
        Region: 'Europe'
      },
      {
        name: 'Danube Film Partners',
        Category: 'Distributor',
        Country: 'United Kingdom',
        Region: 'Europe'
      },
      {
        name: 'Berlin Creative Studios',
        Category: 'Studio',
        Country: 'United Kingdom',
        Region: 'Europe'
      },
      {
        name: 'Dublin Media Group',
        Category: 'Post Production',
        Country: 'Ireland',
        Region: 'Europe'
      }

    ];

    return companies;
  }
}

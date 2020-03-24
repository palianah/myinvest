<template>
  <div class="dashboard px-5">
    <v-row>
      <v-col cols="12" md="4">
        <div class="dashboard__chart pr-5">
          <h2>Stock value in $</h2>
          <BarChart :chartdata="barData" />
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="dashboard__chart pr-5">
          <h2>Captial assets %</h2>
          <DoghnutChart :chartdata="doghnutData" />
        </div>
      </v-col>
      <v-col cols="12" md="4">
        <div class="dashboard__chart pr-5">
          <h2>Amount per Captial Group</h2>
          <LineChart :chartdata="lineData" />
        </div>
      </v-col>
    </v-row>

    <div class="dashboard__table">
      <v-card>
        <v-card-title>
          Finance Group Items
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="10"
          :search="search"
          class="elevation-1"
        >
          <template v-slot:item.profit="{ item }">
            <v-chip :color="getColor(item.profit)" dark>{{
              item.profit
            }}</v-chip>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <br />
    <hr />
    <br />
    <h2>TODO welche Auflistung ich brauche in Tabellenform</h2>
    <ul>
      <li>
        Auflistung aller Gruppen e.g P2P, ETF, Aktien (inkl. Untergruppen
        drunter, eingerückt)
      </li>
      <li>
        Einzelne Gruppe als Headline, Auflistung Untergruppen, Anzahl, Budget,
        Wie viel in Plus/Minus oder Rendite wenn P2P
      </li>
    </ul>

    <br />
    <hr />
    <br />
    <h2>TODO welche Auflistung ich brauche in Chart</h2>
    <ul>
      <li>
        Doghnut Chart aller Gruppen, wie viel Prozent jede Gruppe investiert
      </li>
      <li>
        Bar Chart aller Untergruppen (e.g AMD, Apple...), y-Achse ist
        investierter Wert
      </li>
      <li>
        Line Chart aller Single Aktien (e.g AMD, Apple...), y-Achse ist
        Kurs-Wert, x-Achse ist Datum
      </li>
    </ul>

    <br />
    <hr />
    <br />
    <h2>TODO Features</h2>
    <ul>
      <li>
        Total Capital assets anzeigen, links (nicht editierbar, dynamisch je
        nach Items)
      </li>
      <li>
        Obergruppe erstellen/editieren/löschen im Modal, Button links
      </li>
      <li>
        Untergruppe erstellen/editieren/löschen im Modal, Dropdown Auswahl der
        Obergruppe
      </li>
      <li>
        Einzelne Untergruppen Amount/Wert hinzufügen/löschen können,
        zusammenberechnen inklusive fee kosten wenn vorhanden
      </li>
      <li>
        Stock API anbinden in Tabellen Item Ansicht, und meinen TotalWert von
        AMD %-Wert und Total-Wert anzeigen
      </li>
      <li>
        Stock API anbinden um aktuelle Kurse der Items anzuzeigen (andere Seite)
      </li>
    </ul>
  </div>
</template>

<script>
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import DoghnutChart from '@/components/charts/DoghnutChart'

export default {
  data() {
    return {
      // chart
      lineData: {
        labels: ['P2P', 'ETF', 'Stocks'],
        datasets: [
          {
            label: 'Assets %',
            data: [50, 20, 30],
            fill: false,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      doghnutData: {
        labels: ['P2P', 'ETF', 'Stocks'],
        datasets: [
          {
            data: [50, 20, 30],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      barData: {
        labels: ['Apple', 'AMD', 'Microsoft', 'Intel', 'Alibaba'],
        datasets: [
          {
            label: '',
            data: [142, 45, 132, 70, 84],
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      // table
      search: '',
      headers: [
        {
          text: 'Exposition',
          sortable: false,
          value: 'exposition',
        },
        { text: 'Name', value: 'name' },
        { text: 'Amount', value: 'amount' },
        { text: 'Total invested', value: 'invested' },
        { text: 'Current Value', value: 'curval' },
        { text: 'Profit', value: 'profit' },
      ],
      desserts: [
        {
          exposition: 'P2P',
          name: 'Mintos Palian',
          amount: 1,
          invested: 1420,
          curval: 1470,
          profit: '+50',
        },
        {
          exposition: 'P2P',
          name: 'Mintos Hyewon',
          amount: 1,
          invested: 13160,
          curval: 13140,
          profit: '-20',
        },
        {
          exposition: 'P2P',
          name: 'Bondora',
          amount: 1,
          invested: 0,
          curval: 0,
          profit: 0,
        },
        {
          exposition: 'P2P',
          name: 'Crowdstar',
          amount: 1,
          invested: 6850,
          curval: 6950,
          profit: '+100',
        },
        {
          exposition: 'P2P',
          name: 'Grupeer',
          amount: 1,
          invested: 2450,
          curval: 2410,
          profit: '-40',
        },
        {
          exposition: 'ETF',
          name: 'MSCI World',
          amount: 346,
          invested: 6300,
          curval: 4500,
          profit: '-1800',
        },
        {
          exposition: 'ETF',
          name: 'MSCI Tech',
          amount: 50,
          invested: 2400,
          curval: 1800,
          profit: '-600',
        },
        {
          exposition: 'Stock',
          name: 'AMD',
          amount: 350,
          invested: 13000,
          curval: 14500,
          profit: '-1500',
        },
      ],
    }
  },
  methods: {
    getColor(profit) {
      if (profit > 0) return 'green'
      else if (profit === 0) return 'orange'
      else return 'red'
    },
  },
  components: {
    BarChart,
    LineChart,
    DoghnutChart,
  },
}
</script>

<style lang="less" scoped>
.dashboard {
  &__chart {
    margin: 0 auto;
    max-width: 350px;
  }
}
</style>

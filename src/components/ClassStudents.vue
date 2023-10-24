<template>
    <div class="section">
      <div class="container">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ item.description }}</td>
              <td>{{ item.mis_id }}</td>
            </tr>
          </tbody>
        </table>
  
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
          <a class="pagination-previous" @click="currentPage > 1 ? prevPage : null" :class="{ 'disabled-link': currentPage === 1 }">Previous</a>
          <a class="pagination-next" @click="nextPage">Next</a>
          <ul class="pagination-list">
            <li v-for="page in pageCount" :key="page">
              <a class="pagination-link" @click="gotoPage(page)" :class="{ 'is-current': page === currentPage }">{{ page }}</a>
            </li>
          </ul>
        </nav>
      </div>
      <div>
    </div>
    <div>
      <button
        v-if="!showStudentsList"
        class="button is-primary"
        @click="showStudentsList = true"
        :class="{ 'is-success': showStudentsList }"
      >
        Show Students List
      </button>
  </div>
    </div>
    <class-list
      v-if="showStudentsList"
      >
    </class-list>
  </template>
  
  <script>  
  import ClassStudents from './components/ClassStudents.vue';

  export default {
    components: {
    'class-students': ClassStudents,
  },
    name: 'ClassStudents',
    data() {
      return {
        apiData: [],
        currentPage: 1,
        itemsPerPage: 10,
        pageCount: 0,
      };
    },
    methods: {
      fetchData() {
        const url = "https://api.wonde.com/v1.0/schools/A1930499544/students";
        const headers = {
          Authorization: "b594413a99c7f566718c8d200989933b128eb791",
        };
  
        this.apiData = [];
  
        fetch(url, {
          method: "GET",
          headers: headers,
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data.data)) {
              this.apiData = data.data;
            } else {
              console.error("API response does not contain an array in the 'data' property.");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage * this.itemsPerPage < this.apiData.length) {
          this.currentPage++;
        }
      },
    },
    computed: {
      paginatedData() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.apiData.slice(start, end);
      },
    },
    mounted() {
      this.fetchData();
    },
  };
  </script>
  
  <style>
  @import 'bulma/css/bulma.min.css';
  
  .disabled-link {
    pointer-events: none; /* Prevent click events */
    color: #ccc; /* Change the color to gray or your desired disabled color */
  }
  </style>
  
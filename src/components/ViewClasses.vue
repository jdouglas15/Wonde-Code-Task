<template>
<div>
    <hr>
    <h3 class="title is-4"> {{ staffObj.title }} {{ staffObj.forename }} {{ staffObj.surname }}</h3>
  </div>
  <div
    v-if="!viewAllStudentsInClass">
    <p class="title is-4">{{ numberOfClasses }} Classes</p>
    <hr>
    <table class="table is-fullwidth">
      <caption>Classes Data</caption>
      <thead>
        <tr>
          <th>#</th>
          <th>Date & Time</th>
          <th>Description</th>
          <th>Subject</th>
          <th>View Students</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(classItem, index) in staffObj.classes.data" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ classItem.id }}</td>
          <td>{{ classItem.description }}</td>
          <td>{{ classItem.subject }}</td>
          <td> <button class="button is-info" @click="viewStudentsInClass(classItem.name)">View</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <view-students-in-class
    v-if="viewAllStudentsInClass"
    :ClassName="specificClassName"
    >
  </view-students-in-class>
</template>
  
  <script>
  import ViewStudentsInClass from './ViewStudentsInClass.vue';
  export default {
    components: {
    'view-students-in-class': ViewStudentsInClass
  },
    props: {
      staffObj: {
      type: Object, 
    },
  },
  data() {
    return {
      numberOfClasses: this.staffObj.classes.data.length,
      viewAllStudentsInClass: false
    };
  },
  mounted() {
    this.fetchClassPeriodData();
   },
  methods: {
    viewStudentsInClass(className) {
        this.viewAllStudentsInClass = true
        this.specificClassName = className;
    },
    fetchClassPeriodData() {
        const url = "https://api.wonde.com/v1.0/schools/A1930499544/lessons";
        const headers = {
          Authorization: "b594413a99c7f566718c8d200989933b128eb791",
        };
  
        this.lessonObj = [];
  
        fetch(url, {
          method: "GET",
          headers: headers,
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data.data)) {
              this.lessonObj = data.data;
            } else {
              console.error("API response does not contain an array in the 'data' property.");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
  }
  };
  </script>
  
  <style>
    @import '~bulma/css/bulma.min.css';
  </style>
  
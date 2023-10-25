<template>
  <div>
    <hr>
    <h3 class="title is-4"> {{ staffObj.title }} {{ staffObj.forename }} {{ staffObj.surname }}</h3>
  </div>
  <div
    v-if="!viewAllStudentsInClass">
    <p class="title is-4">{{ numberOfClasses }} Classes</p>
    <hr>
    <table 
        class="table is-fullwidth"
        >
      <caption>Full Class Data</caption>
      <thead>
        <tr>
          <th>#</th>
          <th>Class ID</th>
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
    <div>
    <hr>
    <p class="title is-4">Classes Today - {{ todaysDate }}</p>
    <div>
    </div>
        <table class="table is-fullwidth">
        <caption>Full Class Data</caption>
        <thead>
            <tr>
            <th>#</th>
            <th>Class ID</th>
            <th>Room</th>
            <th>Time</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(classesToday, index) in lessonObj" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ classesToday.id }}</td>
                <td>{{ classesToday.room }}</td>
                <td>{{ formatTime(classesToday.start_at.date) }}</td>
            </tr>
        </tbody>
        </table>
    </div>
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
    'view-students-in-class': ViewStudentsInClass,
  },
    props: {
      staffObj: {
      type: Object, 
    },
  },
  data() {
    return {
      lessonObj: [],
      numberOfClasses: this.staffObj.classes.data.length,
      viewAllStudentsInClass: false,
      todayDate: new Date()
    };
  },
  mounted() {
    this.fetchClassPeriodDataToday();
   },
   computed: {
    todaysDate() {
     return this.formattedDate(this.todayDate);
    },
    yesterdayDate() {
      const yesterday = new Date();
      yesterday.setDate(this.todayDate.getDate() - 1);
      return this.formattedDate(yesterday);
    },
    tomorrowDate() {
      const tomorrow = new Date();
      tomorrow.setDate(this.todayDate.getDate() + 1);
      return this.formattedDate(tomorrow);
    }
  },
  methods: {
    viewStudentsInClass(className) {
        this.viewAllStudentsInClass = true
        this.specificClassName = className;
    },
    fetchClassPeriodDataToday() {
    const url = `https://api.wonde.com/v1.0/schools/A1930499544/lessons?employee_id=A500460806&lessons_start_after=${this.yesterdayDate}&lessons_start_before=${this.tomorrowDate}`;
    const headers = {
        Authorization: "b594413a99c7f566718c8d200989933b128eb791",
    };

    fetch(url, {
        method: "GET",
        headers: headers,
    })
        .then((response) => response.json())
        .then((data) => {
        if (Array.isArray(data.data)) {
            // Filter the lessons to include only those with employee matching staffObj.id
            this.lessonObj = data.data.filter((lesson) => lesson.employee === this.staffObj.id);
        } else {
            console.error("API Failed");
        }
        })
        .catch((error) => {
        console.error(error);
        });
    },
    formatTime(dateTime) {
        const dateObj = new Date(dateTime);
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },
    formattedDate(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
  }
  };
  </script>
  
  <style>
    @import '~bulma/css/bulma.min.css';
  </style>
  
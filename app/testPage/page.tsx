import { Text } from "@chakra-ui/react";
// import { Client } from "pg";

const Home = () => {
  // const client = new Client({
  //   connectionString: process.env.DATABASE_URL,
  // });
  async function testfunc() {
    // await client.connect();
    // const result = await client.query("SELECT * FROM test_table1");
    // console.log(result.rows);
    const response = await fetch(`api/testdb`);
    const data = response.json();
    console.log("response", response);
    console.log("data", data);
  }
  testfunc();
  return <Text>this is test page</Text>;
};

export default Home;

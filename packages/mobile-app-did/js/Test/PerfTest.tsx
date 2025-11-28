import perf, { firebase } from '@react-native-firebase/perf';
import { View, Button, Text } from 'react-native';
import React from 'react';
import axios from 'axios';
import { styles } from './Test.style';

export const PerfTest = () => {
  const customTrace = async () => {
    await firebase.perf().setPerformanceCollectionEnabled(true);

    // Define & start a trace
    const trace = await perf().startTrace('custom_trace');

    // Define trace meta details
    trace.putAttribute('user', 'abcd');
    trace.putMetric('credits', 30);

    // Stop the trace
    await trace.stop();

    console.log('axios');

    axios({
      method: 'get',
      url: 'https://www.baidu.com/sugrec?prod=pc_his&from=pc_web&json=1&sid=36552_36624_37111_36884_36570_37173_37137_37055_26350_36862_37204&hisdata=%5B%7B%22time%22%3A1661251881%2C%22kw%22%3A%22deprecated%22%7D%2C%7B%22time%22%3A1661254198%2C%22kw%22%3A%22detected%22%7D%2C%7B%22time%22%3A1661308504%2C%22kw%22%3A%22schema%22%7D%2C%7B%22time%22%3A1661308536%2C%22kw%22%3A%22scheme%22%7D%2C%7B%22time%22%3A1661311896%2C%22kw%22%3A%22crc%E5%B8%81%22%7D%2C%7B%22time%22%3A1661311922%2C%22kw%22%3A%22crc%E5%B8%81%E5%90%88%E6%B3%95%E5%90%97%22%7D%2C%7B%22time%22%3A1661314664%2C%22kw%22%3A%22streaminterruptedexception%22%7D%2C%7B%22time%22%3A1661314673%2C%22kw%22%3A%22streaminterruptedexception%E4%BB%80%E4%B9%88%E6%84%8F%E6%80%9D%22%7D%2C%7B%22time%22%3A1661320935%2C%22kw%22%3A%22fighting%20design%22%7D%2C%7B%22time%22%3A1661321062%2C%22kw%22%3A%22%E6%8E%98%E9%87%91%22%7D%5D&_t=1661322004393&req=2&bs=1&csor=0',
    }).then(res => console.log(res.status));
  };
  return (
    <View style={styles.sectionContainer}>
      <View>
        <Text>perf</Text>
        <View>
          <Button title="perf" onPress={() => customTrace()} />
        </View>
      </View>
    </View>
  );
};

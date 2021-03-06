/*
 * The Periodic module is responsible for holding onto periodic tasks which
 * must be executed regularly
 *
 */

import * as logger from 'winston'
import cron from 'cron';

export default class Periodic {
  protected readonly jobs : any;
  protected readonly offset : number;

  /*
   * Requires the feathersjs app instance on initialization
   */
  constructor() {
    this.jobs = {};
    this.offset = this.computeOffset();
    logger.info('Periodic using minute offset of', this.offset);
  }

  runHourly(name, callback) {
    logger.info(`Registering periodic hourly task: ${name}`);
    let schedule = `${this.offset} * * * *`;
    return this.runOnSchedule(name, schedule, callback);
  }

  runDaily(name, callback) {
    logger.info(`Registering periodic dailytask: ${name}`);
    let schedule = `${this.offset} 3 * * *`;
    return this.runOnSchedule(name, schedule, callback);
  }

  runOnSchedule(name, schedule, callback) {
    let job = new cron.CronJob(schedule, callback);
    this.jobs[name] = job;
    job.start();
    return !!(job);
  }

  /*
   * Compute an instance specific minute offset for running hourly tasks in a
   * way that doesn't cause every client to check in at the same time
   *
   * @return Number between 0-59
   */
  computeOffset() {
    return Math.floor(Math.random() * 59);
  }
}

import { CounterModel } from "@models/counter.model";

class CounterRepository {
  /**
   * Atomically increments and returns the next sequence number for `key`.
   * Using findByIdAndUpdate with $inc + upsert avoids race conditions
   * that a "read count, add 1" approach would have under concurrent requests.
   */
  async getNextSequence(key: string): Promise<number> {
    const counter = await CounterModel.findByIdAndUpdate(
      key,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
    return counter!.seq;
  }
}

export const counterRepository = new CounterRepository();

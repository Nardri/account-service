import { Connection } from 'typeorm';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

export default async function loadFixtures(name: string, dbConnection: Connection): Promise<any> {

  let items: any[] = [];
  const fixturePath = path.join(__dirname, '..', `/fixtures/${name}.yml`);
  try {
    items = yaml.safeLoad(fs.readFileSync(fixturePath, 'utf8'));
  } catch (e) {
    console.log('Fixtures error', e);
  }

  if (!items) {
    return;
  }

  const results = [];
  for (const item of items) {
    const entityName = Object.keys(item)[0];
    const data = item[entityName];
    const db = dbConnection
      .createQueryBuilder()
      .insert()
      .into(entityName)
      .values(data)
      .callListeners(false)
      .execute();
    results.push(db);
  }

  await Promise.all(results);
}

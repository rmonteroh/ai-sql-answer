
import { createClient } from '@supabase/supabase-js'
import { SqlDatabase } from 'langchain/sql_db';
import { DataSource } from 'typeorm';

export const supabase = createClient(`${process.env.NEXT_PUBLIC_SUPABASE_URL}`, `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);

export const getDbSchema = async () => {
  const datasource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_DB_HOST,
      port: Number(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USER,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE,
    });
  console.log('datasource', datasource);
  
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    return db;
};
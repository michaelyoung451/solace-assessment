import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { ilike, and, gte, lte, or, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

const getCachedAdvocates = unstable_cache(
  async (
    page: number,
    limit: number,
    city?: string,
    degree?: string,
    minExperience?: number,
    maxExperience?: number,
    searchTerm?: string
  ) => {
    const offset = (page - 1) * limit;
    
    const conditions = [];
    
    if (city) {
      conditions.push(ilike(advocates.city, `%${city}%`));
    }
    
    if (degree) {
      conditions.push(ilike(advocates.degree, `%${degree}%`));
    }
    
    if (minExperience !== undefined) {
      conditions.push(gte(advocates.yearsOfExperience, minExperience));
    }
    
    if (maxExperience !== undefined) {
      conditions.push(lte(advocates.yearsOfExperience, maxExperience));
    }
    
    if (searchTerm) {
      conditions.push(
        or(
          ilike(advocates.firstName, `%${searchTerm}%`),
          ilike(advocates.lastName, `%${searchTerm}%`)
        )
      );
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    let dataQuery: any = db.select().from(advocates);
    let countQuery: any = db.select().from(advocates);
    
    if (whereClause) {
      dataQuery = dataQuery.where(whereClause);
      countQuery = countQuery.where(whereClause);
    }
    
    const [data, totalResult] = await Promise.all([
      dataQuery.limit(limit).offset(offset),
      countQuery
    ]);
    
    return {
      data,
      total: totalResult.length,
      page,
      limit,
      totalPages: Math.ceil(totalResult.length / limit)
    };
  },
  ['advocates'],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ['advocates']
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
  const city = searchParams.get('city') || undefined;
  const degree = searchParams.get('degree') || undefined;
  const minExperience = searchParams.get('minExperience') 
    ? parseInt(searchParams.get('minExperience')!) 
    : undefined;
  const maxExperience = searchParams.get('maxExperience') 
    ? parseInt(searchParams.get('maxExperience')!) 
    : undefined;
  const searchTerm = searchParams.get('search') || undefined;

  try {
    const result = await getCachedAdvocates(
      page,
      limit,
      city,
      degree,
      minExperience,
      maxExperience,
      searchTerm
    );

    return Response.json(result);
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json(
      { error: 'Failed to fetch advocates' },
      { status: 500 }
    );
  }
}

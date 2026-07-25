import Banner from '@/component/Banner'
import CourseCategories from '@/component/CourseCategories'
import TrendingCoursesBanner from '@/component/TrendingCoursesBanner'
import React from 'react'

function Home() {
    return (
        <div className='mt-20'>
            <Banner />
            <CourseCategories />
            <TrendingCoursesBanner />
        </div>
    )
}

export default Home
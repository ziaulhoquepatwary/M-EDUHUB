import Banner from '@/component/Banner'
import ContactSection from '@/component/ContactSection'
import CourseCategories from '@/component/CourseCategories'
import TrendingCoursesBanner from '@/component/TrendingCoursesBanner'
import React from 'react'

function Home() {
    return (
        <div className='mt-20'>
            <Banner />
            <CourseCategories />
            <TrendingCoursesBanner />
            <ContactSection />
        </div>
    )
}

export default Home
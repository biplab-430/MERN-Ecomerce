import { FilterOptions } from '@/config'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'

function Filter({ Filters, handleFilter }) {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-extrabold'>Filters</h2>
      </div>
      <div className='p-4 space-y-4'>
        {Object.keys(FilterOptions).map((sectionId) => (
          <Fragment key={sectionId}>
            <div>
              <h3 className='text-base font-bold'>{sectionId}</h3>
              <div className='grid gap-2 mt-2'>
                {FilterOptions[sectionId].map((option) => (
                  <Label key={option.id} className='flex items-center gap-2 font-medium'>
                    <Checkbox
                      checked={!!(Filters[sectionId]?.includes(option.id))}
                      onCheckedChange={() => handleFilter(sectionId, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export default Filter
